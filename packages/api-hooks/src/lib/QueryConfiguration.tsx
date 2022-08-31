import React, { createContext, useContext } from "react";

interface CommonOptions {
  /**
   * A duration to wait after making a request, to reduce the number of requests
   * in case rapid changes to the arguments are made.
   *
   * Set to `0` to disable debouncing.  Defaults to `100`.
   */
   debounce: number;
}

export interface QueryConfigurationOptions extends CommonOptions {
  /**
   * The maximum duration that requests may be delayed (for debouncing),
   * before they will be sent anyways.
   *
   * Set to `false` (default) to wait indefinitely for debouncing to complete.
   */
  maxDelay: number | false;

  /**
   * A preemptive debounce duration, used to delay all requests.
   *
   * The {@link debounce} property will immediately queue a request, theen wait before
   * sending another - which prioritizes getting back data immediately.
   *
   * {@link waitTime} can be used if may wish to wait before sending a request if
   * multiple changes almost always occur, and you do not care about the speed of getting
   * back data for the first request.
   *
   * By default, {@link waitTime} is set to `0`.
   */
  waitTime: number;
}

const config = createContext<QueryConfigurationOptions>({
  debounce: 100,
  maxDelay: false,
  waitTime: 0,
});

export function useQueryConfiguration() {
  return useContext(config);
}

export interface QueryConfigurationProps extends Partial<CommonOptions> {

  /**
   * The maximum duration that requests may be delayed (for debouncing),
   * before they will be sent anyways.
   *
   * Omit or set to `false` to wait indefinitely for debouncing to complete.
   */
  "max-delay"?: number | false;

  /**
   * A preemptive debounce duration, used to delay all requests.
   *
   * The {@link debounce} property will immediately queue a request, theen wait before
   * sending another - which prioritizes getting back data immediately.
   *
   * waitTime can be used if may wish to wait before sending a request if
   * multiple changes almost always occur, and you do not care about the speed of getting
   * back data for the first request.
   *
   * By default, waitTime is set to `0`.
   */
  "wait-time"?: number;

  children?: React.ReactNode;

}

export const QueryConfiguration: React.FC<QueryConfigurationProps> = ({
  debounce,
  children,
  ...props
}) => {
  return (
    <config.Provider value={{
      debounce: debounce ?? 100,
      maxDelay: props["max-delay"] ?? false,
      waitTime: props["wait-time"] ?? 0,
    }}>
      { children }
    </config.Provider>
  );
}
