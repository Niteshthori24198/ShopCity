
function openMailBox(email, name) {

    let subject = '';

    let body = `Dear%20${name}`;

    const url = `mailto:${email}?subject=${subject}&body=${body}`

    window.location.href = url;

}


let features = [
    "User registration with email verification & Login",
    "Integration of Google authentication as a third-party service",
    "Implementation of authentication using JSON Web Tokens",
    "Hashing of confidential information for enhanced data protection",
    "Password recovery mechanism through the use of email links",
    "Display of a comprehensive product page showcasing all available items",
    "Detailed information page to provide an in-depth view of each product",
    "Inclusion of a product review section for user feedback and evaluations",
    "Creation of a cart page for efficient management of selected items",
    "Seamless checkout process enabling customers to place orders",
    "Real-time quantity management to ensure accurate stock control",
    "Implementation of real-time payment processing utilizing Razorpay",
    "Dedicated order page to monitor and manage customer orders",
    "User profile page facilitating the viewing and updating of personal details",
    "Efficient handling of multimedia data by leveraging AWS S3 services",
    "Contact section to enable users to raise queries or seek assistance",
    "Administration controller equipped with all functionalities",
    "Ability to add, update, and remove items from the inventory",
    "Flexibility to update user roles and block user accounts as necessary",
    "Sending notification emails and alerts to keep users informed",
    "Efficient handling of feedback queries and providing appropriate responses",
    "Monitoring and updating order delivery statuses for improved tracking",
    "Comprehensive dashboard providing real-time insights",
    "Implementing a robust logout mechanism through JWT blacklisting"
]

let allFeaturesHere = document.getElementById('allFeaturesHere')

let featureHtml = features.map((ele) => {
    return getFeature(ele);
}).join(' ')

function getFeature(name) {
    return `<p><i class="fa-solid fa-circle-check fa-fade fa-xl" style="color: #2b8221;"></i>&nbsp; ${name} </p>`
}

allFeaturesHere.innerHTML = featureHtml;

