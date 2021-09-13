import type { DB } from "./db";

export namespace API {
  /**
   * Information required when creating a user
   */
  export type RegisterData = Pick<
    DB.User.Data,
    "fname" | "lname" | "email" | "created_by"
  >;

  /**
   * Data passing with the jwt
   */
  export type UserData = Pick<DB.User.Data, "id" | "fname" | "lname" | "email">;

  /**
   * Return type when the backend successfully executed the
   * username & password checking (no matter password is
   * correct or incorrect)
   *
   * @interface LoginResponse
   */
  export interface LoginResponse {
    success: boolean;
    user?: UserData;
    access?: string;
    refresh?: string;
    err?: string;
  }

  /**
   * Contain the types used in patient registration form
   */
  export type PatientRegistrationFormData = Omit<
    DB.Patient.Data,
    "id" | "created_at"
  >;
}
