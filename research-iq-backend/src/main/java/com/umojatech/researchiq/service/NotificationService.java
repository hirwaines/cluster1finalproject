package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.NotificationResponse;
import com.umojatech.researchiq.entity.Notification;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.NotificationType;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.NotificationRepository;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        User user = getUser(authentication);
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public long getUnreadCount(Authentication authentication) {
        User user = getUser(authentication);
        return notificationRepository.countByUser_IdAndReadStatusFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markRead(UUID notificationId, Authentication authentication) {
        User user = getUser(authentication);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new BusinessException("You can only update your own notifications");
        }

        notification.setReadStatus(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllRead(Authentication authentication) {
        User user = getUser(authentication);
        notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(n -> !n.isReadStatus())
                .forEach(n -> {
                    n.setReadStatus(true);
                    notificationRepository.save(n);
                });
    }

    public Notification createNotification(User targetUser, NotificationType type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(targetUser);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setReadStatus(false);
        return notificationRepository.save(notification);
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId().toString())
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .readStatus(n.isReadStatus())
                .link(n.getLink())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
