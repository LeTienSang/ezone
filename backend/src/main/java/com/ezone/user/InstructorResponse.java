package com.ezone.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstructorResponse {
    private Integer id;
    private Integer userId;
    private String fullName;
    private String avatar;
    private String specialization;
    private Integer experienceYears;
    private String bio;
    private BigDecimal rating;

    public static InstructorResponse fromEntity(Instructor inst) {
        return new InstructorResponse(
                inst.getId(),
                inst.getUser().getId(),
                inst.getUser().getFullName(),
                inst.getUser().getAvatar(),
                inst.getSpecialization(),
                inst.getExperienceYears(),
                inst.getBio(),
                inst.getRating()
        );
    }
}
