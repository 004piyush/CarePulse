package com.carepulse.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class InvalidStatusTransitionException extends RuntimeException{

    public InvalidStatusTransitionException(String message){
        super(message);
    }
}
