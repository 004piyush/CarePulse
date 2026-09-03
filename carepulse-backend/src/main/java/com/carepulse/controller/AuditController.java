package com.carepulse.controller;

import com.carepulse.entity.AuditLog;
import com.carepulse.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ICU_MANAGER', 'ADMIN')")
    public ResponseEntity<Page<AuditLog>> getAllAuditLogs(
            @PageableDefault(size = 20, sort = "timestamp,desc") Pageable pageable) {
        return ResponseEntity.ok(auditService.getAllAuditLogs(pageable));
    }
}
