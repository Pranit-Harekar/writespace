# Writespace

Your Canvas for Words

## Getting Started

Follow these steps to set up the project for local development.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 8 or higher)
- [Supabase](https://supabase.com/) (for database and authentication)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/pranit-harekar/writespace.git
    cd writespace
    ```

2.  Copy the `.env.example` file to `.env` and fill in the required environment variables:

    ```bash
    cp .env.example .env
    ```

    Make sure to set the `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables with your Supabase project credentials.
    You can find these in your Supabase project settings.
    If you don't have a Supabase project yet, you can create one at [supabase.com](https://supabase.com/).
    You can also set up a local Supabase instance using the Supabase CLI. Follow the instructions in the [Supabase CLI documentation](https://supabase.com/docs/guides/cli) to do this.

3.  Install the dependencies:

    ```bash
    npm install
    ```

4.  Start the development server:

    ```bash
    npm run dev
    ```

    This will start the application in development mode. You can view it in your browser at `http://localhost:8080`.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
