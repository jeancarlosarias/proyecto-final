interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
  }
  
  const fakeLogin = (username: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          resolve({ success: true, token: 'fake-token-123' });
        } else {
          resolve({ success: false, message: 'Invalid username or password' });
        }
      }, 1000); // 1-second delay to mimic a network request
    });
  };