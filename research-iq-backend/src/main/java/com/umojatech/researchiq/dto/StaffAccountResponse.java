package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(name = "StaffAccountResponse", description = "Created staff account summary")
public class StaffAccountResponse {

  private String id;
  private String name;
  private String email;
  private String role;
  private String department;
}