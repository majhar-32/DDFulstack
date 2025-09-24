package com.doubtdesk.DoubtDeskBackend.repository;

import com.doubtdesk.DoubtDeskBackend.entity.ResetToken;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    Optional<ResetToken> findByUser(User user);
    Optional<ResetToken> findByOtp(String otp);
}