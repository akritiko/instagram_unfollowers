# Instagram Unfollowers Finder

A secure, client-side web application that helps you discover which Instagram accounts you follow that don't follow you back.

![Instagram Unfollowers Finder](https://img.shields.io/badge/Instagram-Unfollowers%20Finder-E4405F?style=for-the-badge&logo=instagram&logoColor=white)

## 🔍 Overview

Instagram Unfollowers Finder is a privacy-focused web tool that analyzes your Instagram following/followers data to identify accounts that don't follow you back. The tool runs entirely in your browser - no data is sent to any server, ensuring your privacy.

## 🌟 Features

- **Privacy-First**: All processing happens in your browser; no data is stored on servers
- **Easy to Use**: Simple step-by-step instructions
- **Fast Processing**: Quickly identifies unfollowers from Instagram's data export
- **Beautiful Interface**: Clean, Instagram-inspired design
- **Searchable Results**: Easily search through your unfollowers list
- **Mobile-Friendly**: Works great on both desktop and mobile devices

## 🚀 How to Use

1. **Download your Instagram data**:
   - Go to [Instagram Account Center](https://accountscenter.instagram.com/info_and_permissions/dyi/)
   - Request your data in HTML format (select "Followers and Following" information)
   - Wait for the email notification that your data is ready

2. **Process your data**:
   - Download and unzip the data package from Instagram
   - Upload `following.html` and `followers_1.html` files to the application
   - Click "Find Unfollowers" to generate your results

3. **View your results**:
   - A new HTML file will be generated and downloaded
   - Open the file to see accounts that don't follow you back
   - Use the search function to find specific accounts

## 🔒 Security & Privacy

This application prioritizes your privacy:

- **No Server Processing**: All processing happens locally in your browser
- **No Data Storage**: Your files are never uploaded to any server
- **No Tracking**: No analytics or tracking scripts included
- **Open Source**: Code is available for review to ensure transparency

## 💻 Technical Details

- **Pure Frontend**: Built with vanilla JavaScript, HTML, and CSS
- **No Dependencies**: Minimal external dependencies (only Bootstrap for UI)
- **Lightweight**: Fast loading and processing
- **Compatible**: Works with modern browsers (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation for Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/instagram-unfollowers-finder.git
   ```

2. Navigate to the project directory:
   ```bash
   cd instagram-unfollowers-finder
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server
   
   # Using Node.js with http-server
   npx http-server
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This project is not affiliated with, authorized, maintained, sponsored or endorsed by Instagram or any of its affiliates or subsidiaries. This is an independent and unofficial project. Use at your own risk.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by [Apostolos Kritikos](https://linkedin.com/in/apostoloskritikos)

---

If you find this tool useful, please consider giving it a star on GitHub! ⭐ 