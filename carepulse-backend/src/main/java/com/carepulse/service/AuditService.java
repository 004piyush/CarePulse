package com.carepulse.service;

import com.carepulse.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {
    Page<AuditLog> getAllAuditLogs(Pageable pageable);
}
