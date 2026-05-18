export const dummyCourses = [
  {
    id: 1,
    title: "IELTS Intensive - Chinh phục 7.5+",
    image: "https://images.unsplash.com/photo-1546410531-ea4cea477149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    instructor: "Nguyễn Thị A",
    price: "4.500.000đ",
    duration: "3 tháng",
    students: 120
  },
  {
    id: 2,
    title: "Giao tiếp Tiếng Anh từ con số 0",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    instructor: "Trần Văn B",
    price: "3.200.000đ",
    duration: "2 tháng",
    students: 85
  },
  {
    id: 3,
    title: "TOEIC 800+ Cam kết đầu ra",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    instructor: "Lê C",
    price: "2.800.000đ",
    duration: "2.5 tháng",
    students: 200
  }
];

export const dummySessions = [
  {
    id: 1,
    course: "IELTS Intensive",
    date: "20/05/2026",
    time: "18:00 - 20:00",
    room: "Phòng 301",
    link: "https://zoom.us/j/123456789",
    status: "Sắp tới"
  },
  {
    id: 2,
    course: "Giao tiếp Tiếng Anh",
    date: "21/05/2026",
    time: "19:30 - 21:00",
    room: "Online",
    link: "https://meet.google.com/abc-xyz",
    status: "Sắp tới"
  }
];

export const dummyMaterials = [
  {
    id: 1,
    title: "Slide Bài 1 - Introduction",
    type: "PDF",
    size: "2.5 MB",
    uploadedAt: "2 ngày trước",
    bgColor: "bg-red-100",
    textColor: "text-primary"
  },
  {
    id: 2,
    title: "Từ vựng cần nhớ (Unit 1)",
    type: "DOC",
    size: "1.2 MB",
    uploadedAt: "hôm qua",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600"
  }
];

export const dummyAssignments = [
  {
    id: 1,
    title: "Homework Unit 1",
    status: "Chưa nộp",
    description: "Hoàn thành bài tập trắc nghiệm trong file đính kèm và nộp lại bản scan hoặc file Word.",
    deadline: "23:59 - 22/05/2026",
    submittedAt: null
  },
  {
    id: 2,
    title: "Placement Test",
    status: "Đã nộp",
    description: "",
    deadline: null,
    submittedAt: "15:30 - 15/05/2026"
  }
];

export const dummyScores = [
  {
    id: 1,
    assignmentName: "Placement Test",
    submittedDate: "15/05/2026",
    score: 8.0,
    feedback: "Từ vựng tốt, cần chú ý ngữ pháp câu điều kiện."
  },
  {
    id: 2,
    assignmentName: "Homework Unit 1",
    submittedDate: "20/05/2026",
    score: 9.0,
    feedback: "Làm bài xuất sắc, tiếp tục phát huy nhé!"
  }
];

export const dummyUser = {
  name: "Nguyễn Văn A",
  role: "Học viên",
  avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=CE1835&color=fff"
};

export const dummyStudentStats = {
  attendance: {
    percentage: "85%",
    details: "10 Có mặt / 2 Vắng"
  },
  gpa: {
    score: "8.5",
    classification: "Xếp loại Giỏi"
  },
  assignments: {
    submitted: "4/5",
    details: "Còn 1 bài tập tới hạn"
  }
};

export const dummyLandingStats = {
  courses: "50+",
  students: "10k+",
  rating: "4.8/5"
};

export const dummyInstructors = [
  {
    id: 1,
    name: "Nguyễn Thị A",
    specialty: "Chuyên gia IELTS 8.5",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Hơn 5 năm kinh nghiệm luyện thi IELTS, đã giúp hàng nghìn học viên đạt mục tiêu.",
    rating: "4.9/5",
    students: "2000+"
  },
  {
    id: 2,
    name: "Trần Văn B",
    specialty: "Thạc sĩ Ngôn ngữ Anh",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Giảng viên tâm huyết với phương pháp giảng dạy giao tiếp phản xạ tự nhiên.",
    rating: "4.8/5",
    students: "1500+"
  },
  {
    id: 3,
    name: "Lê C",
    specialty: "Cựu giám khảo TOEIC",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Chuyên gia luyện thi TOEIC cấp tốc, nắm vững mọi thủ thuật làm bài.",
    rating: "4.9/5",
    students: "3000+"
  }
];

export const dummyAboutUs = {
  title: "Về ezone",
  mission: "Sứ mệnh của chúng tôi là mang đến nền tảng học tập trực tuyến chất lượng cao, dễ tiếp cận và hiệu quả nhất cho mọi người.",
  vision: "Trở thành hệ thống LMS hàng đầu, kết nối hàng triệu học viên với những giảng viên xuất sắc nhất.",
  coreValues: [
    { title: "Chất lượng", description: "Cam kết chất lượng giảng dạy và nội dung học tập tốt nhất." },
    { title: "Sáng tạo", description: "Không ngừng đổi mới phương pháp giáo dục trực tuyến." },
    { title: "Tận tâm", description: "Luôn đồng hành và hỗ trợ học viên trên mọi bước đường." }
  ]
};

export const dummyTeacher = {
  name: "Trần Văn B",
  role: "Giảng viên",
  avatar: "https://ui-avatars.com/api/?name=Tran+Van+B&background=CE1835&color=fff"
};

export const dummyAdmin = {
  name: "Quản trị viên",
  role: "Admin",
  avatar: "https://ui-avatars.com/api/?name=Admin&background=111827&color=fff"
};

export const dummyAdminStats = {
  totalUsers: 10500,
  totalCourses: 52,
  totalRevenue: "1.2B VNĐ",
  activeClasses: 120
};

export const dummyUsersList = [
  { id: 1, name: "Nguyễn Văn A", email: "a.nguyen@example.com", role: "Học viên", status: "Hoạt động", date: "20/05/2026" },
  { id: 2, name: "Trần Văn B", email: "b.tran@example.com", role: "Giảng viên", status: "Hoạt động", date: "15/04/2026" },
  { id: 3, name: "Lê Thị C", email: "c.le@example.com", role: "Học viên", status: "Khóa", date: "10/01/2026" }
];

export const dummyTeacherClasses = [
  { id: 1, name: "IELTS Intensive K45", schedule: "T2, T4 (18:00 - 20:00)", students: 25, status: "Đang diễn ra" },
  { id: 2, name: "Giao tiếp Tiếng Anh K12", schedule: "T3, T5 (19:30 - 21:00)", students: 15, status: "Sắp bắt đầu" }
];

export const dummySubmissions = [
  { id: 1, studentName: "Nguyễn Văn A", assignment: "Homework Unit 1", submittedAt: "22/05/2026", status: "Chưa chấm" },
  { id: 2, studentName: "Lê Thị C", assignment: "Placement Test", submittedAt: "15/05/2026", status: "Đã chấm", score: 8.5 }
];

export const dummyPayments = [
  { id: 1, student: "Nguyễn Văn A", course: "IELTS Intensive K45", amount: "4.500.000đ", date: "20/05/2026", status: "Chờ duyệt" },
  { id: 2, student: "Lê Thị C", course: "Giao tiếp Tiếng Anh K12", amount: "3.200.000đ", date: "15/05/2026", status: "Đã duyệt" }
];
