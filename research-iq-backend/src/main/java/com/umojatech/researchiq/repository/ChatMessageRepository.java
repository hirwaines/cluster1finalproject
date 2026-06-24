package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender.id = :userId AND m.receiver.id = :otherId) OR " +
           "(m.sender.id = :otherId AND m.receiver.id = :userId) " +
           "ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversation(@Param("userId") UUID userId, @Param("otherId") UUID otherId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.readStatus = false")
    long countUnreadByReceiverId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.readStatus = false")
    long countUnreadBetween(@Param("senderId") UUID senderId, @Param("receiverId") UUID receiverId);

    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.receiver ELSE m.sender END " +
           "FROM ChatMessage m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<com.umojatech.researchiq.entity.User> findConversationPartners(@Param("userId") UUID userId);
}
