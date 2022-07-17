export interface InterceptorConfig {

  /**
   * Passed to `class-transformer` to control what fields are exposed.
   */
  additionalGroups?: string[];

  /**
   * Override all groups used by `class-transformer` to control exposed information.
   * This will override {@link additionalGroups}, {@link info}, and many other
   * configuration properties.
   *
   * To add additional exposed groups while still maintaining usage of {@link info}
   * and other configuration settings, use {@link additionalGroups}.
   */
  groups?: string[];

  /**
   * Many built-in models are configurable to control how much information is
   * exposed in error messages and other locations.
   *
   * This may include details like "an unexpected error was thrown by the database"
   * or "there is an SQL table named 'users' with these columns: [...]"
   *
   * Information revealed may help someone utalize exploits and weaknesses elsewhere
   * in the system, but should not create security volunterabilities by itself.
   * However, it's possible something will get accidentally exposed.
   *
   * We enable `info` by default, but highly cautious environments may wish to
   * disable `info` in production environments.
   */
  info?: boolean;

  /**
   * Many built-in properties in `fp` are configured to conditionally expose
   * sensitive details in error messages.
   *
   * This data is very likely useful for developers, but contains details that
   * will definitely risk security if left exposed in production.
   *
   * See {@link info} to control details that are potentially sensitive or otherwise
   * may expose details about your server's implementation and data structures,
   * but isn't likely to create security volunerabilities on it's own.
   *
   * By default, debug mode is enabled only if `NODE_ENV` is `development`.
   */
  debug?: boolean;

}
