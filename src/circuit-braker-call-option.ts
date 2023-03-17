import { RpcCallOption } from 'lite-ts-rpc';
import CircuitBreaker from 'opossum';

export type CircuitBreakerRpcCallOption = RpcCallOption & {
    app: string;
    breakerOptions?: CircuitBreaker.Options;
};