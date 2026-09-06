package com.socialmedia.config;

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

    public static final String QUEUE =
            "message-notification-queue";

    public static final String EXCHANGE =
            "socialmedia.exchange";

    public static final String ROUTING_KEY =
            "message.sent";


    @Bean
    public Queue messageNotificationQueue() {

        return new Queue(
                QUEUE,
                true
        );
    }


    @Bean
    public DirectExchange messageNotificationExchange() {

        return new DirectExchange(
                EXCHANGE,
                true,
                false
        );
    }


    @Bean
    public Binding messageNotificationBinding(
            Queue messageNotificationQueue,
            DirectExchange messageNotificationExchange) {

        return BindingBuilder
                .bind(messageNotificationQueue)
                .to(messageNotificationExchange)
                .with(ROUTING_KEY);
    }


    @Bean
    public MessageConverter messageConverter() {

        return new Jackson2JsonMessageConverter();
    }


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
