# Passwordless || Temporary Access Links Generator

This project aims to provide a simple and secure way to generate temporary access links that can be shared with users for a specified duration of time. These links can be used to grant access to certain authenticated actions within the application without requiring a traditional username and password.

## Features

- Generate temporary access links based on combinations of username and hash.
- Links are valid only for a specified duration of time.
- No need for traditional passwords, enhancing security and convenience.
- Suitable for scenarios where unique user authentication is not necessary, such as feedback forms or limited-time access to certain features.

## Technologies Used

- Next.js 14
- Node.js `crypto` module for generating hashes
- Middleware functionality in Next.js for handling requests

## Setup Instructions

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/titasmallick/passwordless.git```
2. Install dependencies:

    ```bash
    npm install
    ```
    Configure your environment variables as needed. You may need to set up environment variables for secret keys, token expiration durations, etc.

3. Run the application:

    ```bash
    npm run dev
    ```
    Access the application in your browser at http://localhost:3000.

# Usage
To generate a temporary access link, use the provided API endpoint or functionality within the application.
Share the generated link with the intended users.
Users can access the link within the specified duration to perform authenticated actions within the application.
# GenerateLink Component

The `GenerateLink` component is a React component used to generate pre-signed links for temporary access to authenticated actions within the application.

<!-- ## Usage

To use the `GenerateLink` component, import it into your React application and include it in your component tree. Here's an example of how you can use it:

```jsx
import GenerateLink from '@/components/GenerateLink';

const App = () => {
  return (
    <div>
      <GenerateLink />
    </div>
  );
};

export default App;
``` -->
# Contributing
Contributions are welcome! If you have any suggestions, feature requests, or bug reports, please open an issue or submit a pull request.

# License
This project is licensed under the MIT License.