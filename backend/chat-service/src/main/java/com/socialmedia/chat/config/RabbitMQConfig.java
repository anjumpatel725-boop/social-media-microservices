package com.socialmedia.chat.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // =====================================================
    // QUEUE
    // =====================================================

    public static final String MESSAGE_NOTIFICATION_QUEUE =
            "message-notification-queue";


    // =====================================================
    // EXCHANGE
    // =====================================================

    public static final String MESSAGE_NOTIFICATION_EXCHANGE =
            "socialmedia.exchange";


    // =====================================================
    // ROUTING KEY
    // =====================================================

    public static final String MESSAGE_NOTIFICATION_ROUTING_KEY =
            "message.sent";


    // =====================================================
    // QUEUE BEAN
    // =====================================================

    @Bean
    public Queue messageNotificationQueue() {

        return new Queue(
                MESSAGE_NOTIFICATION_QUEUE,
                true
        );
    }


    // =====================================================
    // EXCHANGE BEAN
    // =====================================================

    @Bean
    public DirectExchange messageNotificationExchange() {

        return new DirectExchange(
                MESSAGE_NOTIFICATION_EXCHANGE,
                true,
                false
        );
    }


    // =====================================================
    // BINDING
    // =====================================================

    @Bean
    public Binding messageNotificationBinding(
            Queue messageNotificationQueue,
            DirectExchange messageNotificationExchange) {

        return BindingBuilder
                .bind(messageNotificationQueue)
                .to(messageNotificationExchange)
                .with(MESSAGE_NOTIFICATION_ROUTING_KEY);
    }


    // =====================================================
    // JSON MESSAGE CONVERTER
    // =====================================================

    @Bean
    public MessageConverter messageConverter() {

        return new Jackson2JsonMessageConverter();
    }


    // =====================================================
    // RABBIT TEMPLATE
    // =====================================================

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter) {

        RabbitTemplate rabbitTemplate =
                new RabbitTemplate(connectionFactory);

        rabbitTemplate.setMessageConverter(messageConverter);

        return rabbitTemplate;
    }
}
