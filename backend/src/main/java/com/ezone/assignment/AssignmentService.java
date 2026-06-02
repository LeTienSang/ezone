package com.ezone.assignment;

import com.ezone.classroom.ClassEntity;
import com.ezone.classroom.ClassRepository;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ForbiddenException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final ScoreRepository scoreRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             SubmissionRepository submissionRepository,
                             ScoreRepository scoreRepository,
                             ClassRepository classRepository,
                             UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.scoreRepository = scoreRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getClassAssignments(Integer classId, String username) {
        log.info("Fetching assignments for class ID: {} by user: {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        checkClassAccess(user, classEntity);

        List<Assignment> assignments = assignmentRepository.findByClassEntityId(classId);
        List<AssignmentResponse> responses = new ArrayList<>();

        for (Assignment a : assignments) {
            AssignmentResponse res = new AssignmentResponse();
            res.setId(a.getId());
            res.setTitle(a.getTitle());
            res.setDescription(a.getDescription());
            res.setDueDate(a.getDueDate());
            res.setMaxScore(a.getMaxScore());

            if (user.getRole() == User.Role.STUDENT) {
                Optional<Submission> optSub = submissionRepository.findByAssignmentIdAndStudentId(a.getId(), user.getId());
                if (optSub.isPresent()) {
                    res.setSubmissionStatus("submitted");
                    Submission sub = optSub.get();
                    SubmissionResponse subRes = new SubmissionResponse();
                    subRes.setId(sub.getId());
                    subRes.setStudentId(user.getId());
                    subRes.setStudentName(user.getFullName());
                    subRes.setAssignmentId(a.getId());
                    subRes.setAssignmentTitle(a.getTitle());
                    subRes.setContent(sub.getContent());
                    subRes.setFileUrl(sub.getFileUrl());
                    subRes.setSubmittedAt(sub.getSubmittedAt());

                    Optional<Score> optScore = scoreRepository.findBySubmissionId(sub.getId());
                    if (optScore.isPresent()) {
                        subRes.setScore(optScore.get().getScore());
                        subRes.setTeacherFeedback(optScore.get().getTeacherFeedback());
                    }
                    res.setSubmission(subRes);
                } else {
                    res.setSubmissionStatus("pending");
                    res.setSubmission(null);
                }
            } else {
                res.setSubmissionStatus(null);
                res.setSubmission(null);
            }
            responses.add(res);
        }

        return responses;
    }

    @Transactional
    public Assignment createAssignment(Integer classId, String username, CreateAssignmentRequest req) {
        log.info("Creating assignment in class ID: {} by user: {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        if (classEntity.getInstructor() == null ||
                !classEntity.getInstructor().getUser().getUsername().equals(username)) {
            log.warn("User {} is not authorized to create assignment for class ID {}", username, classId);
            throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
        }

        LocalDateTime due;
        try {
            due = LocalDateTime.parse(req.getDueDate());
        } catch (DateTimeParseException e) {
            log.warn("Invalid due date format: {}", req.getDueDate());
            throw new BadRequestException("Định dạng hạn nộp bài không hợp lệ");
        }

        if (due.isBefore(LocalDateTime.now())) {
            log.warn("Due date {} is in the past", due);
            throw new BadRequestException("Hạn nộp bài phải lớn hơn thời gian hiện tại");
        }

        Assignment assignment = new Assignment();
        assignment.setClassEntity(classEntity);
        assignment.setTitle(req.getTitle());
        assignment.setDescription(req.getDescription());
        assignment.setDueDate(due);
        assignment.setMaxScore(req.getMaxScore() != null ? req.getMaxScore() : 10);

        Assignment saved = assignmentRepository.save(assignment);
        log.info("Assignment created successfully: ID={}, title={}", saved.getId(), saved.getTitle());
        return saved;
    }

    @Transactional
    public Submission submitAssignment(Integer assignmentId, String username, MultipartFile file, String content) throws IOException {
        log.info("User {} is submitting assignment ID {}", username, assignmentId);
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học viên"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài tập không tồn tại"));

        ClassEntity classEntity = assignment.getClassEntity();
        if (!classEntity.getStudents().contains(student)) {
            log.warn("Student {} is not a member of class ID {}", username, classEntity.getId());
            throw new ForbiddenException("Bạn không phải thành viên lớp học này");
        }

        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            log.warn("Submission rejected: past due date {} for assignment ID {}", assignment.getDueDate(), assignmentId);
            throw new BadRequestException("Đã hết hạn nộp bài");
        }

        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            String orig = file.getOriginalFilename();
            if (orig != null) {
                String lower = orig.toLowerCase();
                if (lower.endsWith(".exe") || lower.endsWith(".bat") || lower.endsWith(".sh") || lower.endsWith(".cmd") || lower.endsWith(".com")) {
                    log.warn("Blocked unsupported file type upload: {}", orig);
                    throw new BadRequestException("Định dạng file không được hỗ trợ");
                }
            }
            fileUrl = saveFile(file, "submissions");
        }

        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(new Submission());

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent(content);
        if (fileUrl != null) {
            submission.setFileUrl(fileUrl);
        }
        submission.setSubmittedAt(LocalDateTime.now());

        Submission saved = submissionRepository.save(submission);
        log.info("Submission saved successfully: ID={}", saved.getId());
        return saved;
    }

    @Transactional
    public Score scoreSubmission(Integer submissionId, String username, ScoreRequest req) {
        log.info("Teacher {} scoring submission ID: {} with score: {}", username, submissionId, req.getScore());
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Bản nộp bài không tồn tại"));

        Assignment assignment = submission.getAssignment();
        ClassEntity classEntity = assignment.getClassEntity();

        if (classEntity.getInstructor() == null ||
                !classEntity.getInstructor().getUser().getUsername().equals(username)) {
            log.warn("Teacher {} is not assigned to class ID {}", username, classEntity.getId());
            throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
        }

        if (req.getScore().compareTo(BigDecimal.ZERO) < 0 ||
                req.getScore().compareTo(BigDecimal.valueOf(assignment.getMaxScore())) > 0) {
            log.warn("Invalid score value {} (max score is {})", req.getScore(), assignment.getMaxScore());
            throw new BadRequestException("Điểm số không hợp lệ");
        }

        Score score = scoreRepository.findBySubmissionId(submissionId)
                .orElse(new Score());

        score.setSubmission(submission);
        score.setScore(req.getScore());
        score.setTeacherFeedback(req.getTeacherFeedback());
        score.setGradedAt(LocalDateTime.now());

        Score saved = scoreRepository.save(score);
        log.info("Submission graded successfully: Score ID={}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<StudentScoreResponse> getMyScores(String username) {
        log.info("Fetching scores for student: {}", username);
        return scoreRepository.findScoresForStudent(username);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getAssignmentSubmissions(Integer assignmentId, String username) {
        log.info("Fetching submissions for assignment ID: {} by user: {}", assignmentId, username);
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài tập không tồn tại"));

        ClassEntity classEntity = assignment.getClassEntity();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() == null ||
                    !classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
            }
        } else if (user.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("Bạn không có quyền truy cập");
        }

        List<Submission> submissions = submissionRepository.findByAssignmentId(assignmentId);
        List<SubmissionResponse> responses = new ArrayList<>();

        for (Submission s : submissions) {
            Score score = scoreRepository.findBySubmissionId(s.getId()).orElse(null);
            SubmissionResponse resp = new SubmissionResponse();
            resp.setId(s.getId());
            resp.setStudentId(s.getStudent().getId());
            resp.setStudentName(s.getStudent().getFullName());
            resp.setAssignmentId(assignment.getId());
            resp.setAssignmentTitle(assignment.getTitle());
            resp.setContent(s.getContent());
            resp.setFileUrl(s.getFileUrl());
            resp.setSubmittedAt(s.getSubmittedAt());
            if (score != null) {
                resp.setScore(score.getScore());
                resp.setTeacherFeedback(score.getTeacherFeedback());
            }
            responses.add(resp);
        }

        return responses;
    }

    private void checkClassAccess(User user, ClassEntity classEntity) {
        if (user.getRole() == User.Role.ADMIN) {
            return;
        }
        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() != null &&
                    classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                return;
            }
            throw new ForbiddenException("Bạn không có quyền truy cập lớp học này");
        }
        boolean isMember = classEntity.getStudents().contains(user);
        if (!isMember) {
            throw new ForbiddenException("Bạn không phải là thành viên của lớp học này");
        }
    }

    private String saveFile(MultipartFile file, String subFolder) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads", subFolder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + subFolder + "/" + fileName;
    }

    @Transactional
    public void deleteSubmission(Integer assignmentId, String username) {
        log.info("User {} is deleting submission for assignment ID {}", username, assignmentId);
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học viên"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài tập không tồn tại"));

        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Bạn chưa nộp bài tập này"));

        // Check if the due date has passed
        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            log.warn("Cannot delete submission: past due date {} for assignment ID {}", assignment.getDueDate(), assignmentId);
            throw new BadRequestException("Không thể hủy nộp bài vì đã quá hạn");
        }

        // Check if already graded
        boolean graded = scoreRepository.findBySubmissionId(submission.getId()).isPresent();
        if (graded) {
            log.warn("Cannot delete submission: already graded for submission ID {}", submission.getId());
            throw new BadRequestException("Không thể hủy nộp bài vì bài làm đã được chấm điểm");
        }

        // Delete associated file if it exists
        String fileUrl = submission.getFileUrl();
        if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
            try {
                Path filePath = Paths.get(fileUrl.substring(1));
                Files.deleteIfExists(filePath);
                log.info("Deleted file: {}", filePath);
            } catch (IOException e) {
                log.error("Failed to delete file: {}", fileUrl, e);
            }
        }

        submissionRepository.delete(submission);
        log.info("Submission ID {} deleted successfully", submission.getId());
    }
}
