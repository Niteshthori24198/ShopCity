# ***ShopCity 💖***

## Logo

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/de0678ff-33ec-4c4c-848c-a3b405442354)

## Shopcity - Full Stack E-commerce Application

Shopcity, an advanced full-stack e-commerce platform, guarantees a secure and seamless shopping experience. Offering a wide product selection, effortless checkout, thorough review system, and live order tracking, Shopcity revolutionizes online shopping for ultimate convenience and confidence.

## Table of Contents

  - Code Base
  - Technologies Used
  - Features
  - Prerequisites
  - Installation
  - Deployment
  - Usage
  - Contributing
  - License

## Code Base

 - BackEnd/
    - view/
        - forgot-password.html
        - standard.html
    - config/
       - google.auth.js
    - database/
        - db.js
    - controllers/
       - user.controller.js
       - product.controller.js
       - cart.controller.js
       - order.controller.js
       - review.controller.js
    - middlewares/
       - authentication.js
       - authorization.js
    - models/
       - user.model.js
       - product.model.js
       - cart.model.js
       - order.model.js
       - review.model.js
       - reply.model.js
       - query.model.js
       - blacklist.model.js
    - routes/
       - user.routes.js
       - product.routes.js
       - cart.routes.js
       - order.routes.js
       - review.routes.js
       - checkout.route.js
    - index.js
    - package.json
    
  -  FrontEnd/
     - view/
     - Admin/
     - scripts/
     - styles/
     - Images/
     - index.html
  - README.md
  
## Technologies Used

-  Shopcity is built using the following technologies :

-  Frontend :
    - HTML
    - CSS
    - Bootstrap
    - JavaScript
-  Backend :
    - Node.js
    - Express.js
    - mongoose
-  Database :
    - MongoDB Atlas
-  Payment Gateway :
    - Razorpay
-  File Storage :
    - AWS S3
-  Authentication :
    - Google OAuth
    - passport
    - passport-google-oauth20
-  Other Node Packages :
    - JWT
    - bcrypt
    - nodemailer
    - multer
    - sharp
    - @aws-sdk/client-s3
    - @aws-sdk/s3-request-presigner

    
  ## Features
  
  Shopcity offers a wide range of features to both customers and administrators, making it a complete e-commerce solution. 

-  User registration with email verification & Login
-  Integration of Google authentication as a third-party service
-  Password recovery mechanism through the use of email links
-  Implementation of authentication using JSON Web Tokens
-  Hashing of confidential information for enhanced data protection
-  Display of a comprehensive product page showcasing all available items
-  Detailed information page to provide an in-depth view of each product
-  Creation of a cart page for efficient management of selected items
-  Real-time quantity management to ensure accurate stock control
-  Seamless checkout process enabling customers to place orders
-  Implementation of real-time payment processing utilizing Razorpay
-  Dedicated order page to monitor and manage customer orders
-  Inclusion of a product review section for user feedback and evaluations
-  User profile page facilitating the viewing and updating of personal details
-  Efficient handling of multimedia data by leveraging AWS S3 services
-  Contact section to enable users to raise queries or seek assistance
-  Sending notification emails and alerts to keep users informed
-  Administration controller equipped with all functionalities
-  Optimize user experiences across mobile, tablet, and desktop devices with a responsive design.


## Prerequisites

  -  Node Js
  -  MongoDB
  -  npm modules
  -  Git


## Installation

-  Clone the repository : git clone : ***https://github.com/Niteshthori24198/ShopCity***
-  Install dependencies : ***npm install***
-  Start the server : ***npm run server***


## Deployment

  The backend of this project has been deployed using Cyclic, and the front end has been deployed on github.io.
  
  - Github.io : ***https://mrkishansharma.github.io/shop-city.github.io/***
  - BackEnd : ***https://shopcity-mrkishansharma.vercel.app/***
  - Github : ***https://github.com/Niteshthori24198/ShopCity***


## Usage and SnapShots

  Welcome to Shopcity, your premier online shopping destination. Customers enjoy a seamless experience with easy registration, browsing, shopping, and secure real-time payments. Administrators have efficient control over products, orders, and users through our user-friendly platform. For assistance, visit our FAQ or contact our dedicated support team. Shopcity delivers a professional e-commerce experience.


### Home Page

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/9be57043-aa03-4a5c-8d1d-deebfd8d2d20)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/100125f9-ad39-4c40-a32d-f69f306597ec)


### Sign Up Page

-  Complete your profile with essential details. After successful registration, verify your email to gain access and start using our website.
  
![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/6962f77c-f52d-499b-b42d-9e2f9c4ce771)


### Sign In Page

-  The OAuth Authentication features allow users to sign up and log in to the website using their Google accounts.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/f534cda8-bcb9-4b5d-b894-a7cb7c573cc6)


### Product Page

-  Explore our product page for a curated selection of high-quality items to meet your needs and preferences.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/9db78f9c-1678-46bb-8e4b-c889f9ddee91)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/a12c5175-6002-4e8e-8cc0-3dc41b384bd8)


### Product Detailed Page

-  Delve deeper into product details with magnified images and access valuable customer reviews for an informed shopping experience.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/138e8af6-9e53-4b29-9e11-328499bd7d61)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/0159daea-3e3f-40c4-b797-fa9cb26260f4)


### Cart Page

-  Effortlessly manage your shopping cart, adding, removing products, and adjusting quantities to tailor your order to perfection.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/7ce617fd-6988-44a4-b45d-49d581f65801)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/f4e85a5f-2560-46f8-b50f-e0b321894fbf)


### Checkout Page

-  Finalize your order by entering shipping details. Choose from multiple Razorpay payment options or enjoy the flexibility of Cash on Delivery for a seamless shopping experience.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/9ffd8ad3-704f-4286-b9dd-1458fcc73fa7)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/5797d112-3c6c-456a-816f-e24202740be0)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/6d3133ee-b39d-46ea-bc36-b3a9f80303a5)


### Order Page

-  View all your orders here, with the option to cancel if needed. Share your valuable feedback on delivered items to help us serve you better.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/10a6be7c-71ec-47d1-9237-fbddc0c8563c)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/2f1f1689-2414-4590-bee8-e2eccbf74dc2)


### Profile Page

-  Manage your profile effortlessly. View and update personal details, change your password, and add a personal touch with a custom profile picture.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/10a187cf-3aa7-4db5-8d9f-c60ca35fab79)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/c22ad129-1c80-445a-b53c-c30ba35ba626)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/0471e008-ef4f-4850-8dc4-401f93615795)


### Contact Page

-  Reach out to us for assistance with account creation, payments, order queries, or any other concerns you may have.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/8f06d88f-86f8-4ee4-9da7-01e010266d8a)


## Administration Controls

-  Empower administrators with comprehensive control and management tools for seamless oversight of products, orders, and user accounts


### Dashboard Page

-  Track product performance, orders, revenue, and user growth on our dashboard for informed, data-driven decisions and control.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/68d5db90-cb9d-435a-a6fa-ff5b5ce34294)


### User Control Page

-  Effortlessly manage user accounts in one place. Take control by blocking users when needed, and send alert emails to keep your user community informed and engaged.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/85a6f934-2038-4970-812d-2b28dd5c28a5)


### Product Control Page

-  Admins can easily manage the product catalog here. Add new products, update quantities, and make changes to details and images effortlessly to keep your offerings up to date.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/91d6c0fb-5095-43ab-bd32-ab165dc4fced)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/78bd30fd-9295-41da-93e0-db1d72f0bfd0)

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/08de0bda-6b59-48a8-9c7f-8d518c7350a7)


### Order Control Page

-  Effortlessly manage orders with the ability to update order statuses and easily keep track of all your orders in one place for streamlined order processing.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/45a229bb-a53a-4026-9101-a52efcac6ec7)


### Review Manage Page

-  Explore user reviews, filter out inaccurate feedback, and empower customers to make informed choices by providing a curated selection of valuable product reviews.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/564fd140-ae70-4c40-b527-ae3c423d7c92)


### Feedback Query Page

-  Effortlessly handle user queries, process them, and send announcement emails to address issues promptly and keep your users informed about the resolution.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/684e6ecd-f814-4dc2-9fac-f6bed512bcf3)


### About us

-  Discover comprehensive details about the website's functionality and easily access developer contact information for inquiries and support.

![image](https://github.com/Niteshthori24198/ShopCity/assets/62844049/adfb8e9a-3b10-4132-a81b-1427207e981e)


## Contributing Team Details

  We welcome contributions from the community to help improve Shopcity and make it even better.

-  Nitesh Kumar
-  Kishan Sharma


## License

  This project is licensed under the MIT License. See the LICENSE file for details.
