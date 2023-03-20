import { RpcCallOption } from 'lite-ts-rpc';
import CircuitBreaker from 'opossum';

export type CircuitBreakerRpcCallOption = RpcCallOption & {
    breakerOptions?: CircuitBreaker.Options;
};