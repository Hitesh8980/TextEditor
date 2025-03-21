# 📧 Email Template Editor

A modern, user-friendly email template editor built with React and TipTap, designed to streamline the creation of professional email templates. This editor supports dynamic variable insertion (e.g., `{{user_name}}`) and mentions (e.g., `@JohnDoe`), with a sleek interface styled using Tailwind CSS.

## ✨ Features

- **Dynamic Variables** 🖋️: Insert variables like `{{user_name}}` or `{{company}}` with a suggestion popover triggered by `{{`.
- **Mentions Support** 👤: Add mentions like `@JohnDoe` with a suggestion popover triggered by `@`.
- **Rich Text Editing** 📝: Powered by TipTap, with support for bold, italic, headings, lists, and more.
- **Export Options** 📤: Export your templates as PDF or Markdown, in both raw and rendered formats.
- **Professional Styling** 🎨: Built with Tailwind CSS for a modern, responsive design.
- **Local Storage** 💾: Automatically saves your content to local storage for persistence.
## 🎥 Demo

Watch the demo video below to see the Email Template Editor in action:

![Demo Video](https://user-images.githubusercontent.com/your-github-username/some-id/demo-video.mp4)

> **Note**: If the video doesn’t play, you can download it [here](https://github.com/your-github-username/your-repo-name/raw/main/demo-video.mp4).


## 🛠️ Installation

Follow these steps to set up the Email Template Editor on your local machine.

### 📋 Prerequisites

- **Node.js** (v14 or higher) 🟢
- **npm** (v6 or higher) or **yarn** 📦
- A modern web browser (e.g., Chrome, Firefox) 🌐

### Steps

1. **Clone the Repository** 📂

   ```bash
   git clone https://github.com/your-github-username/your-repo-name.git
   cd your-repo-name
2. Install Dependencies ⚙️

  Using npm:

      
      npm install
        
4. Run the Application ▶️

   Start the development server: 
    
       npm run dev
4. Open in Browser 🌍

Open your browser and navigate to http://localhost:5173. You should see the Email Template Editor interface.    

### 📖 Usage
1. **Create a Template ✍️:**

 - Start typing in the editor.

 - Use {{ to trigger the variable suggestion popover (e.g., select {{user_name}} to insert a user name variable).

 - Use @ to trigger the mention suggestion popover (e.g., select @JohnDoe to insert a mention).

2. **Export Your Template 📥:**

 - Click "PDF (Raw)" to export the template as a PDF with variables/mentions as-is.

 - Click "PDF (Rendered)" to export the template as a PDF with variables/mentions replaced (e.g., {{user_name}} becomes John Doe).

 - Use "MD (Raw)" or "MD (Rendered)" to export as Markdown.

3. **Clear Content 🗑️:**

 - Click the "Clear" button to reset the editor and remove saved content from local storage.
### **🤝 Contributing**

Contributions are welcome! If you’d like to contribute, please follow these steps:

 - Fork the repository 🍴.
 - Create a new branch (git checkout -b feature/your-feature-name) 🌿.
 - Make your changes and commit them (git commit -m "Add your feature") 💻.
 - Push to your branch (git push origin feature/your-feature-name) 🚀.
 - Open a pull request with a detailed description of your changes 📬.
