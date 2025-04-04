export const POSTS = [
    {
        _id: "1",
        text: "Quote of the day😍",
        img: "/posts/post1.png",
        user: {
            username: "Ram",
            profileImg: "/avatars/boy1.png",
            fullName: "Sri Ram",
        },
        comments: [
            {
                _id: "1",
                text: "Lets go!",
                user: {
                    username: "srijalattala",
                    profileImg: "/avatars/girl1.png",
                    fullName: "Srija Lattala",
                },
            },
        ],
        likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
    },
    {
        _id: "2",
        text: "How you guys doing? 😊",
        user: {
            username: "Surya",
            profileImg: "/avatars/boy2.png",
            fullName: "Surya Prakash",
        },
        comments: [
            {
                _id: "1",
                text: "I'm doing great!",
                user: {
                    username: "srijalattala",
                    profileImg: "/avatars/girl1.png",
                    fullName: "Srija Lattala",
                },
    
            },
        ],
        likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
    },
    {
        _id: "3",
        text: "Astronaut in a room of drawers, generated by Midjourney. 🚀",
        img: "/posts/post2.png",
        user: {
            username: "Krishna",
            profileImg: "/avatars/boy3.png",
            fullName: "Krishna",
        },
        comments: [],
        likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896"],
    },
    {
        _id: "4",
        text: "I'm learning GO this week. Any tips? 🤔",
        img: "/posts/post3.png",
        user: {
            username: "Krishna",
            profileImg: "/avatars/boy3.png",
            fullName: "Krishna",
        },
        comments: [
            {
                _id: "1",
                text: "Try to understand the concurrency model.",
                user: {
                    username: "srijalattala",
                    profileImg: "/avatars/girl1.png",
                    fullName: "Srija Lattala",
                },
            },
        ],
        likes: [
            "6658s891",
            "6658s892",
            "6658s893",
            "6658s894",
            "6658s895",
            "6658s896",
            "6658s897",
            "6658s898",
            "6658s899",
        ],
    },
];

export const USERS_FOR_RIGHT_PANEL = [
    {
        _id: "1",
        fullName: "Sri Ram",
        username: "sriram",
        profileImg: "/avatars/boy1.png",
    },
    {
        _id: "2",
        fullName: "Mahalakshmi",
        username: "mahalakshmi",
        profileImg: "/avatars/girl1.png",
    },
    {
        _id: "3",
        fullName: "Raghav",
        username: "raghav",
        profileImg: "/avatars/boy3.png",
    },
    {
        _id: "4",
        fullName: "Sailaja",
        username: "sailaja",
        profileImg: "/avatars/girl2.png",
    },
];