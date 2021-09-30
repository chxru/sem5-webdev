import type { DB } from "./db";

export namespace API {
  /**
   * Default response format used in API
   *
   * @export
   * @interface Response
   */
  export interface Response<T = any> {
    success: boolean;
    err?: string;
    data?: T;
  }

  export namespace Auth {
    /**
     * Information required when creating a user
     */
    export interface RegisterData
      extends Pick<DB.User.Data, "fname" | "lname" | "email" | "created_by"> {
      password: string;
    }

    /**
     * Data passing with the jwt
     */
    export type UserData = Pick<
      DB.User.Data,
      "id" | "fname" | "lname" | "email"
    >;

    /**
     * Return type when the backend successfully executed the
     * username & password checking (no matter password is
     * correct or incorrect)
     *
     * @interface LoginResponse
     */
    export interface LoginResponse {
      user: UserData;
      access: string;
      refresh: string;
    }
  }

  export namespace Patient {
    /**
     * Contain the types used in patient registration form
     */
    export interface RegistrationForm
      extends Omit<DB.Patient.Data, "id" | "created_at"> {
      [key: string]: any;
    }

    /**
     * Format what search request outputs
     *
     * @export
     * @interface SearchDetails
     */
    export interface SearchDetails {
      id: number;
      full_name: string;
    }
  }
}
