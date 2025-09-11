// StackMeme Easter Eggs - Inspired by StackOverflow and developer culture
import { toast } from "sonner"

export const easterEggService = {
    // Console easter eggs
    console: {
        welcome: () => {
            console.log(`
🚀 Welcome to StackMeme! 
   The place where developers share their best memes
   
   Try these commands:
   - stackMeme.help() - Get help
   - stackMeme.stats() - View statistics
   - stackMeme.meme() - Get a random meme fact
   - stackMeme.stackOverflow() - StackOverflow reference
            `);
        },

        help: () => {
            console.log(`
📚 StackMeme Console Commands:
   
   stackMeme.help() - Show this help
   stackMeme.stats() - Show app statistics
   stackMeme.meme() - Random meme fact
   stackMeme.stackOverflow() - StackOverflow reference
   stackMeme.rickroll() - You know what this does...
   stackMeme.answer() - Get a StackOverflow-style answer
   stackMeme.bug() - Report a bug (just kidding)
   stackMeme.feature() - Request a feature (also kidding)
   stackMeme.duplicate() - Mark as duplicate
   stackMeme.accepted() - Mark as accepted answer
            `);
        },

        stats: () => {
            console.log(`
📊 StackMeme Statistics:
   - Memes shared: ∞ (and counting)
   - Developers confused: 100%
   - StackOverflow tabs open: 47
   - Coffee consumed: 12 cups
   - Bugs fixed: 0 (we're adding more)
   - Features requested: 1,337
   - Duplicate questions: 99.9%
            `);
        },

        meme: () => {
            const facts = [
                "Did you know? The first meme was actually a StackOverflow error message.",
                "StackMeme was built in 0.0001 seconds (according to our build logs).",
                "Our memes have 99.9% uptime (the 0.1% is when we're debugging).",
                "Every meme here has been peer-reviewed by at least 3 developers.",
                "We use the same voting system as StackOverflow (but with more laughs).",
                "Our memes are written in TypeScript (for type safety, obviously).",
                "The most upvoted meme here has 42,069 upvotes (nice).",
                "We have a 0% acceptance rate for bug reports (they're all features)."
            ];
            const fact = facts[Math.floor(Math.random() * facts.length)];
            console.log(`🎭 Random Meme Fact: ${fact}`);
        },

        stackOverflow: () => {
            console.log(`
🔗 StackOverflow Reference:
   
   "This question already has an answer here:
    How to center a div? (42 answers)
    
    Closed 3 years ago by Jeff Atwood"
    
   Just kidding! StackMeme is the opposite - 
   we encourage duplicate memes! 🎉
            `);
        },

        rickroll: () => {
            console.log(`
🎵 Never gonna give you up...
   Never gonna let you down...
   Never gonna run around and desert you...
   
   (You've been rickrolled in the console! 🎸)
            `);
        },

        answer: () => {
            const answers = [
                "This is a duplicate of: 'How to make a meme?' - Closed as duplicate.",
                "This question is too broad. Please provide more specific details about your meme.",
                "This question is off-topic for StackMeme. Consider posting on StackOverflow instead.",
                "This meme has been closed as 'not reproducible'.",
                "This question needs more context. What have you tried so far?",
                "This is a duplicate of: 'Why is my code not working?' - Closed as duplicate.",
                "This question is too opinion-based. Please provide objective criteria.",
                "This meme has been closed as 'primarily opinion-based'."
            ];
            const answer = answers[Math.floor(Math.random() * answers.length)];
            console.log(`💬 StackOverflow-style Answer: ${answer}`);
        },

        bug: () => {
            console.log(`
🐛 Bug Report:
   
   Title: "App is working too well"
   Priority: Low
   Status: Won't Fix
   
   Description: "The app is functioning as intended, 
   which is suspicious. Please add more bugs."
   
   Assigned to: The entire development team
   Labels: wontfix, by-design, working-as-intended
            `);
        },

        feature: () => {
            console.log(`
✨ Feature Request:
   
   Title: "Add ability to teleport memes"
   Priority: Critical
   Status: Under Review
   
   Description: "Users should be able to teleport 
   memes directly into their code comments."
   
   Assigned to: The physics department
   Labels: enhancement, teleportation, memes
            `);
        },

        duplicate: () => {
            console.log(`
🔄 Duplicate Detection:
   
   This meme is a duplicate of:
   - "Funny programming meme #1" (42 upvotes)
   - "Another funny programming meme" (69 upvotes)
   - "Yet another funny programming meme" (420 upvotes)
   
   Closing as duplicate. Please upvote the original instead.
            `);
        },

        accepted: () => {
            console.log(`
✅ Accepted Answer:
   
   "This meme has been marked as the accepted answer!
   
   The community has spoken, and this is officially
   the best way to solve the problem of not having
   enough memes in your life."
   
   🏆 Congratulations! You've earned 15 reputation points.
            `);
        },

        debug: () => {
            console.log(`
🐛 JavaScript Debugging Session:
   
   "If you're a JavaScript developer, here's how you'd debug this:"
   
   1. console.log('Starting debug session...');
   2. Set breakpoints in DevTools
   3. Use debugger; statement
   4. Check Network tab for API calls
   5. Inspect elements and console errors
   6. Use console.table() for objects
   7. console.group() for organized logging
   8. console.time() for performance
   9. console.trace() for stack traces
   10. console.assert() for testing
   
   💡 Pro tip: Use console.clear() to start fresh!
            `);
        },

        console: () => {
            console.log(`
🖥️ Console Commands Available:
   
   stackMeme.help() - Show all commands
   stackMeme.debug() - JavaScript debugging tips
   stackMeme.stats() - App statistics
   stackMeme.meme() - Random meme facts
   stackMeme.stackOverflow() - SO references
   stackMeme.rickroll() - You know what this does
   stackMeme.answer() - SO-style answers
   stackMeme.bug() - Report bugs
   stackMeme.feature() - Request features
   stackMeme.duplicate() - Mark as duplicate
   stackMeme.accepted() - Mark as accepted
   
   🎯 Try them all! Each has its own easter egg.
            `);
        }
    },

    // Toast messages for user interactions
    toasts: {
        like: () => {
            const messages = [
                "Upvoted! +15 reputation",
                "This meme is now trending!",
                "You've earned 15 StackMeme points!",
                "Great taste in memes! +1",
                "This meme is now marked as 'useful'",
                "You've helped this meme reach the front page!",
                "This meme is now 'accepted' by the community!",
                "You've given this meme the 'accepted answer' status!"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            toast.success(message);
        },

        upload: () => {
            const messages = [
                "Meme uploaded! Waiting for peer review...",
                "Your meme is now in the queue for moderation",
                "Meme submitted! The community will judge it soon",
                "Upload successful! Your meme is now live",
                "Meme posted! Time to collect those upvotes",
                "Your meme has been added to the knowledge base",
                "Meme published! May the odds be ever in your favor",
                "Upload complete! Your meme is now part of the collective"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            toast.success(message);
        },

        comment: () => {
            const messages = [
                "Comment added! +2 reputation",
                "Your comment is now under review",
                "Comment posted! The community will upvote if it's helpful",
                "Your comment has been added to the discussion",
                "Comment submitted! Waiting for peer review",
                "Your comment is now part of the conversation",
                "Comment posted! Time to see if it gets accepted",
                "Your comment has been added to the knowledge base"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            toast.success(message);
        },

        error: () => {
            const messages = [
                "Error 404: Sense of humor not found",
                "Error 500: Internal server error (we're debugging)",
                "Error 418: I'm a teapot (this is a real HTTP status code)",
                "Error 451: Unavailable for legal reasons (just kidding)",
                "Error 429: Too many requests (slow down, cowboy)",
                "Error 403: Forbidden (you don't have permission to be this funny)",
                "Error 408: Request timeout (your meme took too long to load)",
                "Error 503: Service unavailable (we're taking a coffee break)"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            toast.error(message);
        },

        google: () => {
            const messages = [
                "Google login is not implemented yet! (This is a fake button) 😅",
                "Sorry, Google OAuth is still in development! Try the regular login instead.",
                "This Google button is just for show! We're working on it! 🚧",
                "Google authentication coming soon! For now, use the regular login.",
                "This is a fake Google button! We're still working on OAuth integration.",
                "Google login is under construction! Please use the regular login form.",
                "This Google button is just a placeholder! Regular login works great though.",
                "Google OAuth is in development! The regular login is fully functional."
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            toast.info(message);
        }
    },

    // UI easter eggs
    ui: {
        getRandomStackOverflowQuote: () => {
            const quotes = [
                "This question already has an answer here...",
                "Closed as duplicate",
                "Too broad; please provide more details",
                "Off-topic for StackMeme",
                "Not reproducible",
                "Primarily opinion-based",
                "Needs more context",
                "This is a duplicate of...",
                "Please provide a minimal reproducible example",
                "What have you tried so far?",
                "This question is too broad",
                "This question is off-topic",
                "This question needs more context",
                "This question is primarily opinion-based",
                "This question is not reproducible",
                "This question is a duplicate of...",
                "Please provide more details",
                "Please provide a minimal example",
                "Please provide more context",
                "Please provide more information"
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        },

        getRandomDeveloperJoke: () => {
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                "Why do Java developers wear glasses? Because they can't C#!",
                "What's a programmer's favorite hangout place? The Foo Bar.",
                "Why did the programmer quit his job? He didn't get arrays.",
                "What do you call a programmer from Finland? Nerdic.",
                "Why do programmers hate nature? It has too many bugs.",
                "What's a programmer's favorite type of music? Algo-rhythms.",
                "Why did the programmer go broke? Because he used up all his cache.",
                "What do you call a programmer who doesn't comment their code? A silent partner."
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
    }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    (window as any).stackMeme = {
        help: easterEggService.console.help,
        stats: easterEggService.console.stats,
        meme: easterEggService.console.meme,
        stackOverflow: easterEggService.console.stackOverflow,
        rickroll: easterEggService.console.rickroll,
        answer: easterEggService.console.answer,
        bug: easterEggService.console.bug,
        feature: easterEggService.console.feature,
        duplicate: easterEggService.console.duplicate,
        accepted: easterEggService.console.accepted,
        debug: easterEggService.console.debug,
        console: easterEggService.console.console
    };
}
