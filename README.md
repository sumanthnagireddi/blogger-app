# Online Publishing Platform
**deployed version URL: https://sumanth-article-publishing.web.app/
** Credentials -- username: testuser@mail.com;password: devuser123#

** Github - https://github.com/sumanthnagireddi/articles-publishing-app

## Overview

This project is a  article management system with a focus on user interactions, content management, and advanced features. It leverages Firebase for authentication and storage, and incorporates various functionalities to enhance user experience and content accessibility.

## Features

### 1. Authentication
- **Using Firebase**: Implemented user authentication using Firebase to provide secure login and registration features.
- **Social Authentication**: Implemented social authentication like using google and github using Firebase to provide secure login and registration features.


### 2. Storage
- **Using Firestore**: Utilized Firestore for efficient and scalable data storage.
- **Powerful queries**:Utilized Firestore for efficent data management.

### 3. Home Screen
- **Article Listing**: Displays a list of articles with the following details:
  - Title
  - Thumbnail
  - Brief description
  - Author name
  - Publish date
- **Pagination**: Implemented pagination to navigate through large sets of articles.
- **Sorting**: Added sorting options to organize articles by various criteria.

### 4. Search Functionality
- **Keyword and Author Search**: Enabled users to search for articles by keywords and author names.

### 5. Featured Articles
- **Highlighting Featured Articles**: Showcases featured articles or editor's picks prominently at the top of the home page.

### 6. Author Directory
- **Author Listing**: Displays a directory of all authors with:
  - Profile pictures
  - Brief bios
- **Author Search**: Allows users to search for authors by name.

### 7. Article Details
- **Full Article Display**: Shows the complete content of an article including:
  - Title
  - Author name
  - Publish date
- **Author Bio and Related Articles**: Displays the author's bio and suggests other articles by the same author.
- **Related Articles**: Suggests related articles at the end of the article.

### 8. Comment Section
- **User Comments**: Allows users to post comments on articles.
- **Threaded Comments**: Supports replies to comments for threaded discussions.
- **Comment Sorting**: Provides options to sort comments by newest, oldest, or most liked.

### 9. Create a New Post
- **Rich Text Editor**: Integrated a rich text editor with formatting options such as bold, italic, underline, and lists.
- **Media and Links**: Allows users to add images, videos, and links to their articles.
- **Drafts**: Users can save articles as drafts before publishing.
- **Post Scheduling**: Included an option to schedule posts for future publications

### 10.Bonus Question- Tags
- **Tag Management**: Enabled authors to add tags to their articles.
- **Tag-Based Search and Browsing**: Users can search and explore articles by tags.
- **Popular Tags**: Displays a list of popular tags.
- **Browse by Tags**: Allows users to browse articles categorized by tags.

## Technologies Used

- **Firebase**: For authentication and data storage.
- **Firestore**: For scalable and flexible data management.
- **Angular**: Framework for building the web application.
- **SASS**: Css preprocessor.
- **RxJS**: For reactive programming and handling asynchronous data.
- **Rich Text Editor**: Integrated quill library
