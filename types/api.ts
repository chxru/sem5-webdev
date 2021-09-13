export namespace API {
  /**
   * Data passing with the jwt
   *
   * @export
   * @interface UserData
   */
  export interface UserData {
    id: number;
    fname: string;
    lname: string;
    email: string;
  }
  /**
   * Return type when the backend successfully executed the
   * username & password checking (no matter password is
   * correct or incorrect)
   *
   * @export
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
   *
   * @export
   * @interface PatientRegistrationFormData
   */
  export interface PatientRegistrationFormData {
    fname: string;
    lname: string;
    gender: string;
    dob: {
      d: number;
      m: number;
      y: number;
    };
    address: string;
    email: string;
    tp: string;
    admission: {
      d: number;
      m: number;
      y: number;
      dic: string;
    };
  }
}
