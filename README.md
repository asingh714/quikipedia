# Quikipedia


[![Home Page] (/Users/amansingh/Desktop/Quikipedia_1.png)](https://www.quikipedia.com/)

[![Search Page] (/Users/amansingh/Desktop/Quikipedia_2.png)](https://www.quikipedia.com/) 


## Introduction

Quikipedia is a concise information platform inspired by the extensive knowledge repository of Wikipedia. Designed to provide quick, short summaries on a wide array of topics, Quikipedia offers an efficient way to gain insight without the need to navigate through detailed articles. Our service is especially useful for users looking for quick facts or an overview of a subject matter.

## Contact

**Aman Singh**

- Email: [amsingh714@gmail.com](mailto:amsingh714@gmail.com)
- Portfolio: [amans.dev](https://amans.dev)
- Project Link: [Quikipedia](https://www.quikipedia.com/)

## About This Project

Quikipedia was born out of a fascination with artificial intelligence and a desire to simplify access to information. In a world where data is abundant, finding concise and relevant summaries can be challenging. This project leverages OpenAI's GPT-4, a cutting-edge AI, to generate accurate and succinct content from Wikipedia's vast knowledge base.


## Features

- **Quick Summaries**: Get concise summaries of topics with just a click.
- **Search Functionality**: A user-friendly search bar on the main page makes finding topics easy.
- **Responsive Design**: Optimized for both desktop and mobile devices, ensuring access to information anytime, anywhere.
- **Rich Content**: Each summary is accompanied by relevant images to enhance understanding.

## Technologies

Quikipedia is built with a robust stack to ensure a seamless user experience:

### Backend

- **Node.js** and **Express.js**: For building the RESTful API.
- **Cors** for handling Cross-Origin Resource Sharing.
- **Dotenv** for managing environment variables.
- **Helmet** for securing HTTP headers.
- **Morgan** for logging HTTP requests.
- **OpenAI**: Integration with OpenAI's GPT-4 for generating dynamic content.

### Frontend

- **React**: A powerful library for building the user interface.
- **Axios** for promise-based HTTP requests.
- **React Query**: Efficient server state management in React applications.
- **React Router DOM**: For dynamic routing.



### Utilities

- **Wikipedia API**: Fetches search results, suggestions, extracts, and random wiki pages.
- **Custom Utilities**: Including functions for formatting search terms and handling API requests.


### Installation

1. Clone the repository:
   ```git clone https://github.com/asingh714/quikipedia```
   
2. Install NPM packages for both server and client:

	```		
	# For the server
	cd server
	npm install
	
	# For the client
	cd client
	npm install
	```
3. Start the server: ```npm run server```
4. Run the client application: ```npm run dev```	

### Usage
- **Home Page**: Features a search bar for entering topics and a button for fetching random summaries.
- **Search Functionality**: Users can search for specific topics or choose to explore random ones. The search bar supports suggestions for a better user experience.
- **Context Provider**: Utilizes React Context to manage global state across components, including search terms, modes, and navigation.