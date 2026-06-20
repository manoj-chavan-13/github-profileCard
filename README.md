# GitHub Impact Cards 🚀

Elevate your GitHub profile with premium, portfolio-quality dynamic SVG cards. GitHub Impact Cards fetches your real-time GitHub statistics and generates a sleek, modern card that seamlessly integrates into your `README.md`.

## ✨ Features

- **Real-Time Data:** Uses the GitHub GraphQL API to fetch your latest stats.
- **True All-Time Contributions:** Dynamically calculates total contributions and your longest contribution streak across *all years* you've been active.
- **Premium Aesthetics:** Features a beautiful dark-mode UI with proper typographical hierarchy.
- **Dynamic Responsiveness:** Automatically scales down the font size if your username is long to ensure perfect layout fidelity.
- **High Performance:** SVGs are cached for 1 hour to ensure lightning-fast loading and to prevent rate-limiting from the GitHub API.

## 🚀 Usage

You can use the hosted API directly in your GitHub `README.md`! Just add the following Markdown or HTML snippet:

### Markdown:
```md
![My GitHub Impact](https://github-profileCard.vercel.app/api/impact?username=manoj-chavan-13)
```

### HTML (Recommended for centering):
```html
<p align="center">
  <img src="https://github-profileCard.vercel.app/api/impact?username=manoj-chavan-13" alt="GitHub Impact Card" />
</p>
```

*(Note: Replace `your_username` with your actual GitHub username)*

## 🛠️ Self-Hosting / Local Development

If you want to host this yourself or run it locally, follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- A GitHub Personal Access Token (PAT) with `read:user` and `repo` permissions.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manoj-chavan-13/github-profileCard.git
   cd github-profileCard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Rename `.env.example` to `.env` and insert your GitHub Token.
   ```env
   GITHUB_TOKEN=your_personal_access_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The API will be available at: `http://localhost:3000/api/impact?username=manoj`

## ☁️ Deployment

This project is built with a serverless architecture designed perfectly for **Vercel**.

1. Fork or clone this repository to your GitHub account.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Go to **Environment Variables** in the Vercel setup and add:
   - Key: `GITHUB_TOKEN`
   - Value: `your_personal_access_token_here`
5. Click **Deploy**.

## 📄 License
MIT License. Feel free to use and modify it!
