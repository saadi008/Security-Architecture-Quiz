// Quiz Application
class EntrepreneurshipQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.bookmarkedQuestions = new Set();
        this.startTime = null;
        this.isDarkTheme = false;
        this.selectedSection = 1; // Default to section 1
        this.sectionRanges = {
            1: { start: 1, end: 100 },
            2: { start: 101, end: 200 },
            3: { start: 201, end: 300 }
        };
        this.timer = null;
        this.timeLimit = 100 * 60; // 100 minutes in seconds
        this.remainingTime = this.timeLimit;
        this.initializeApp();
    }

    async initializeApp() {
        try {
            this.showLoadingScreen();
            await this.loadQuestions();
            this.initializeUI();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to load quiz data. Please refresh the page.');
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('./mcqs.json');
            if (!response.ok) throw new Error('Failed to load questions');
            this.allQuestions = await response.json();
        } catch (error) {
            this.allQuestions = this.getEmbeddedQuestions();
        }
        // Default to section 1
        this.setSectionQuestions(1);
    }

    setSectionQuestions(section) {
        this.selectedSection = section;
        const { start, end } = this.sectionRanges[section];
        this.questions = this.allQuestions.filter(q => q.number >= start && q.number <= end);
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.bookmarkedQuestions.clear();
        this.remainingTime = this.timeLimit;
        this.updateTimerDisplay();
    }

    initializeUI() {
        this.bindEvents();
        this.updateTheme();
        this.showScreen('welcome-screen');
    }

    bindEvents() {
        document.getElementById('start-section-select').addEventListener('click', () => this.showScreen('section-select-screen'));
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('view-instructions').addEventListener('click', () => this.showScreen('instructions-screen'));
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showScreen('welcome-screen'));
        document.getElementById('back-to-welcome-section').addEventListener('click', () => this.showScreen('welcome-screen'));
        // Section 1 start
        document.querySelectorAll('.start-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = parseInt(e.target.closest('.section-card').dataset.section);
                this.setSectionQuestions(section);
                this.showScreen('quiz-screen');
                this.updateQuizDisplay();
                document.getElementById('section-number').textContent = section;
                document.getElementById('total-questions').textContent = this.questions.length;
            });
        });
        // Quiz events
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('review-btn').addEventListener('click', () => this.showReviewScreen());
        document.getElementById('finish-btn').addEventListener('click', () => this.finishQuiz());
        document.getElementById('bookmark-btn').addEventListener('click', () => this.toggleBookmark());
        document.getElementById('theme-toggle-quiz').addEventListener('click', () => this.toggleTheme());
        // Option selection
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => this.selectOption(e.currentTarget.dataset.option));
        });
        
        // Review screen events
        document.getElementById('back-to-quiz').addEventListener('click', () => this.showScreen('quiz-screen'));
        document.getElementById('submit-quiz').addEventListener('click', () => this.submitQuiz());
        
        // Results screen events
        document.getElementById('review-answers').addEventListener('click', () => this.showAnswerReview());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('back-to-home').addEventListener('click', () => this.showScreen('welcome-screen'));
        
        // Answer review screen events
        document.getElementById('close-review').addEventListener('click', () => this.showScreen('results-screen'));
        
        // Filter events for answer review
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterReviewItems(e.currentTarget.dataset.filter));
        });
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 1000);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        if (screenId === 'quiz-screen') {
            this.updateQuizDisplay();
            this.startTimer(); // Start timer when quiz begins
        } else {
            this.stopTimer(); // Stop timer when leaving quiz
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.remainingTime = this.timeLimit;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();
            
            // Check for time warnings
            if (this.remainingTime === 300) { // 5 minutes left
                this.showTimeWarning('5 minutes remaining!');
            } else if (this.remainingTime === 60) { // 1 minute left
                this.showTimeWarning('1 minute remaining!');
            } else if (this.remainingTime === 30) { // 30 seconds left
                this.showTimeWarning('30 seconds remaining!');
            }
            
            // Time's up!
            if (this.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timer-display').textContent = display;
        
        // Update timer container styling based on remaining time
        const timerContainer = document.querySelector('.timer-container');
        timerContainer.classList.remove('warning', 'danger');
        
        if (this.remainingTime <= 300) { // 5 minutes or less
            timerContainer.classList.add('warning');
        }
        if (this.remainingTime <= 60) { // 1 minute or less
            timerContainer.classList.add('danger');
        }
    }

    showTimeWarning(message) {
        // Create a temporary warning message
        const warning = document.createElement('div');
        warning.className = 'answer-feedback';
        warning.textContent = message;
        warning.style.background = 'rgba(239, 68, 68, 0.95)';
        document.body.appendChild(warning);
        
        // Remove warning after 3 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }

    timeUp() {
        clearInterval(this.timer);
        this.showTimeWarning('Time\'s up! Submitting quiz...');
        
        // Auto-submit after 2 seconds
        setTimeout(() => {
            this.finishQuiz();
        }, 2000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.bookmarkedQuestions.clear();
        this.startTime = new Date();
        this.showScreen('quiz-screen');
        this.updateQuizDisplay();
    }

    updateQuizDisplay() {
        if (this.currentQuestionIndex >= this.questions.length) return;
        
        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('section-number').textContent = this.selectedSection;
        document.getElementById('current-question').textContent = question.number;
        document.getElementById('total-questions').textContent = this.questions.length;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
        
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('option-a').textContent = question.options.A;
        document.getElementById('option-b').textContent = question.options.B;
        document.getElementById('option-c').textContent = question.options.C;
        document.getElementById('option-d').textContent = question.options.D;
        
        // Clear all option classes
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Show previous answer if exists
        const selectedAnswer = this.answers[question.number];
        if (selectedAnswer) {
            const selectedOption = document.querySelector(`[data-option="${selectedAnswer}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
                
                // Show correct/incorrect feedback for answered questions
                if (selectedAnswer === question.answer) {
                    selectedOption.classList.add('correct');
                } else {
                    selectedOption.classList.add('incorrect');
                    // Also show correct answer
                    const correctOption = document.querySelector(`[data-option="${question.answer}"]`);
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }
            }
        }
        
        this.updateBookmarkButton();
        this.updateNavigationButtons();
    }

    selectOption(option) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const questionNumber = currentQuestion.number;
        
        // Check if answer is already submitted for this question
        if (this.answers[questionNumber]) {
            return; // Don't allow changing answers
        }
        
        // Store the answer
        this.answers[questionNumber] = option;
        
        // Remove selected class from all options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to chosen option
        const selectedOption = document.querySelector(`[data-option="${option}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Show correct/incorrect feedback
        this.showAnswerFeedback(option, currentQuestion.answer);
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    showAnswerFeedback(selectedOption, correctAnswer) {
        // Remove any existing feedback classes
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
        });
        
        // Show correct answer in green
        const correctOption = document.querySelector(`[data-option="${correctAnswer}"]`);
        if (correctOption) {
            correctOption.classList.add('correct');
        }
        
        // Show selected option in red if wrong
        if (selectedOption !== correctAnswer) {
            const wrongOption = document.querySelector(`[data-option="${selectedOption}"]`);
            if (wrongOption) {
                wrongOption.classList.add('incorrect');
            }
        }
        
        // Add a small delay to show the feedback
        setTimeout(() => {
            // Auto-advance to next question after 1.5 seconds
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestion();
            }
        }, 1500);
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.updateQuizDisplay();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.updateQuizDisplay();
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        // Previous button
        if (this.currentQuestionIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.disabled = false;
            prevBtn.classList.remove('disabled');
        }
        
        // Next button
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
    }

    toggleBookmark() {
        const question = this.questions[this.currentQuestionIndex];
        const questionNumber = question.number;

        if (this.bookmarkedQuestions.has(questionNumber)) {
            this.bookmarkedQuestions.delete(questionNumber);
        } else {
            this.bookmarkedQuestions.add(questionNumber);
        }

        this.updateBookmarkButton();
    }

    updateBookmarkButton() {
        const question = this.questions[this.currentQuestionIndex];
        const bookmarkBtn = document.getElementById('bookmark-btn');
        const icon = bookmarkBtn.querySelector('i');

        if (this.bookmarkedQuestions.has(question.number)) {
            icon.className = 'fas fa-bookmark';
            bookmarkBtn.style.color = 'var(--warning-color)';
        } else {
            icon.className = 'far fa-bookmark';
            bookmarkBtn.style.color = 'var(--text-secondary)';
        }
    }

    showReviewScreen() {
        this.showScreen('review-screen');
    }

    updateReviewScreen() {
        const answeredCount = Object.keys(this.answers).length;
        const bookmarkedCount = this.bookmarkedQuestions.size;

        document.getElementById('answered-count').textContent = answeredCount;
        document.getElementById('unanswered-count').textContent = this.questions.length - answeredCount;
        document.getElementById('bookmarked-count').textContent = bookmarkedCount;
    }

    finishQuiz() {
        this.stopTimer();
        // Calculate results and show results screen
        this.updateResultsScreen();
        this.showScreen('results-screen');
    }

    submitQuiz() {
        this.showScreen('results-screen');
    }

    updateResultsScreen() {
        const answeredQuestions = Object.keys(this.answers).length;
        let correctAnswers = 0;

        // Calculate correct answers
        Object.keys(this.answers).forEach(questionNumber => {
            const question = this.questions.find(q => q.number == questionNumber);
            if (question && this.answers[questionNumber] === question.answer) {
                correctAnswers++;
            }
        });

        const percentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
        const incorrectAnswers = answeredQuestions - correctAnswers;

        // Calculate time taken
        const endTime = new Date();
        const timeTaken = Math.round((endTime - this.startTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update results display
        document.getElementById('score-percentage').textContent = `${percentage}%`;
        document.getElementById('correct-answers').textContent = correctAnswers;
        document.getElementById('total-answered').textContent = answeredQuestions;
        document.getElementById('correct-count').textContent = correctAnswers;
        document.getElementById('incorrect-count').textContent = incorrectAnswers;
        document.getElementById('quiz-time').textContent = timeString;

        // Update score circle
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.style.background = `conic-gradient(var(--primary-color) ${percentage * 3.6}deg, var(--border) ${percentage * 3.6}deg)`;

        // Update score text
        const scoreText = document.getElementById('score-text');
        const scoreDescription = document.getElementById('score-description');
        
        if (percentage >= 90) {
            scoreText.textContent = 'Excellent!';
        } else if (percentage >= 80) {
            scoreText.textContent = 'Great Job!';
        } else if (percentage >= 70) {
            scoreText.textContent = 'Good Work!';
        } else if (percentage >= 60) {
            scoreText.textContent = 'Not Bad!';
        } else {
            scoreText.textContent = 'Keep Learning!';
        }
    }

    showAnswerReview() {
        this.showScreen('answer-review-screen');
        this.populateReviewList();
    }

    populateReviewList() {
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';

        this.questions.forEach(question => {
            const userAnswer = this.answers[question.number];
            const isCorrect = userAnswer === question.answer;
            const isBookmarked = this.bookmarkedQuestions.has(question.number);
            const isAnswered = userAnswer !== undefined;

            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'} ${isBookmarked ? 'bookmarked' : ''}`;
            reviewItem.dataset.filter = this.getReviewItemFilter(isCorrect, isBookmarked, isAnswered);

            reviewItem.innerHTML = `
                <div class="review-item-header">
                    <h4>Question ${question.number}</h4>
                    <div class="review-item-status">
                        ${isBookmarked ? '<i class="fas fa-bookmark" title="Bookmarked"></i>' : ''}
                        ${isCorrect ? '<i class="fas fa-check" title="Correct"></i>' : '<i class="fas fa-times" title="Incorrect"></i>'}
                    </div>
                </div>
                <p class="review-question">${question.question}</p>
                <div class="review-options">
                    ${Object.entries(question.options).map(([key, value]) => `
                        <div class="review-option ${this.getReviewOptionClass(key, question.answer, userAnswer)}">
                            <span class="option-label">${key}</span>
                            <span class="option-text">${value}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            reviewList.appendChild(reviewItem);
        });
    }

    getReviewItemFilter(isCorrect, isBookmarked, isAnswered) {
        if (isBookmarked) return 'bookmarked';
        if (!isAnswered) return 'unanswered';
        return isCorrect ? 'correct' : 'incorrect';
    }

    getReviewOptionClass(optionKey, correctAnswer, userAnswer) {
        if (optionKey === correctAnswer) return 'correct-answer';
        if (optionKey === userAnswer && userAnswer !== correctAnswer) return 'incorrect-answer';
        return '';
    }

    filterReviewItems(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter review items
        document.querySelectorAll('.review-item').forEach(item => {
            const itemFilter = item.dataset.filter;
            if (filter === 'all' || itemFilter === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    restartQuiz() {
        this.startQuiz();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.updateTheme();
    }

    updateTheme() {
        const theme = this.isDarkTheme ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icons
        const themeIcons = document.querySelectorAll('#theme-toggle i, #theme-toggle-quiz i');
        themeIcons.forEach(icon => {
            icon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    showError(message) {
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    getEmbeddedQuestions() {
        return [
            {
                "number": 1,
                "question": "What is the primary purpose of branding?",
                "options": {
                    "A": "To create advertisements",
                    "B": "To launch new products", 
                    "C": "To create a unique identity and perception in consumers' minds",
                    "D": "To reduce business expenses"
                },
                "answer": "C"
            },
            {
                "number": 2,
                "question": "Which of the following is NOT a key element of a strong brand?",
                "options": {
                    "A": "Brand Name",
                    "B": "Brand Voice",
                    "C": "Brand Story", 
                    "D": "Balance Sheet"
                },
                "answer": "D"
            },
            {
                "number": 3,
                "question": "What is included in a brand's visual identity?",
                "options": {
                    "A": "Customer reviews",
                    "B": "Profit margins",
                    "C": "Logo, color scheme, typography",
                    "D": "Mission statement"
                },
                "answer": "C"
            },
            {
                "number": 4,
                "question": "What is a 'brand story'?",
                "options": {
                    "A": "A list of achievements",
                    "B": "A detailed marketing report",
                    "C": "A narrative that explains the brand's purpose and builds connection",
                    "D": "A financial summary of the brand"
                },
                "answer": "C"
            },
            {
                "number": 5,
                "question": "What does the term \"perpetual process\" in branding imply?",
                "options": {
                    "A": "It is done once during a product launch",
                    "B": "It stops once the brand is recognized",
                    "C": "Branding must evolve continuously with market and customer changes",
                    "D": "Branding applies only to online businesses"
                },
                "answer": "C"
            },
            {
                "number": 6,
                "question": "What defines a brand voice?",
                "options": {
                    "A": "The founder's speaking style",
                    "B": "The tone and style of communication used by the brand",
                    "C": "The logo design",
                    "D": "Customer complaints"
                },
                "answer": "B"
            },
            {
                "number": 7,
                "question": "How does branding create emotional connection?",
                "options": {
                    "A": "By lowering prices",
                    "B": "By connecting with customers' values and identities",
                    "C": "Through expensive ads",
                    "D": "By hiding weaknesses"
                },
                "answer": "B"
            },
            {
                "number": 8,
                "question": "Who are considered stakeholders in branding?",
                "options": {
                    "A": "Only customers",
                    "B": "Only employees",
                    "C": "Only investors",
                    "D": "Customers, employees, partners, and the public"
                },
                "answer": "D"
            },
            {
                "number": 9,
                "question": "What contributes to perceived brand value?",
                "options": {
                    "A": "Number of employees",
                    "B": "Consistent branding and storytelling",
                    "C": "Price of product",
                    "D": "The age of the company"
                },
                "answer": "B"
            },
            {
                "number": 10,
                "question": "What should a brand story begin with?",
                "options": {
                    "A": "The company's pricing",
                    "B": "The founder's favorite color",
                    "C": "The brand's purpose beyond making profit",
                    "D": "A social media strategy"
                },
                "answer": "C"
            },
            {
                "number": 11,
                "question": "What is the main goal of brand positioning?",
                "options": {
                    "A": "To increase production costs",
                    "B": "To occupy a distinct place in the target market's mind",
                    "C": "To reduce marketing expenses",
                    "D": "To copy competitors"
                },
                "answer": "B"
            },
            {
                "number": 12,
                "question": "Which of the following is a key component of brand positioning?",
                "options": {
                    "A": "Financial statements",
                    "B": "Unique value proposition",
                    "C": "Employee handbook",
                    "D": "Office location"
                },
                "answer": "B"
            },
            {
                "number": 13,
                "question": "What is brand differentiation?",
                "options": {
                    "A": "Making your product cheaper",
                    "B": "Highlighting what makes your brand unique from competitors",
                    "C": "Copying successful brands",
                    "D": "Reducing product quality"
                },
                "answer": "B"
            },
            {
                "number": 14,
                "question": "What is the purpose of a brand promise?",
                "options": {
                    "A": "To make false claims",
                    "B": "To communicate what customers can expect from the brand",
                    "C": "To increase prices",
                    "D": "To confuse competitors"
                },
                "answer": "B"
            },
            {
                "number": 15,
                "question": "What is brand consistency?",
                "options": {
                    "A": "Always using the same price",
                    "B": "Maintaining uniform brand elements across all touchpoints",
                    "C": "Never changing anything",
                    "D": "Using the same employees"
                },
                "answer": "B"
            },
            {
                "number": 16,
                "question": "What is brand equity?",
                "options": {
                    "A": "The financial value of the brand",
                    "B": "The value a brand adds to a product beyond its functional benefits",
                    "C": "The cost of creating the brand",
                    "D": "The number of products sold"
                },
                "answer": "B"
            },
            {
                "number": 17,
                "question": "What is brand awareness?",
                "options": {
                    "A": "How much money the brand makes",
                    "B": "How well customers recognize and recall the brand",
                    "C": "The number of employees",
                    "D": "The brand's age"
                },
                "answer": "B"
            },
            {
                "number": 18,
                "question": "What is brand loyalty?",
                "options": {
                    "A": "Employees staying with the company",
                    "B": "Customers' commitment to repeatedly purchase from the brand",
                    "C": "The brand's legal status",
                    "D": "The brand's location"
                },
                "answer": "B"
            },
            {
                "number": 19,
                "question": "What is brand perception?",
                "options": {
                    "A": "What the company thinks about itself",
                    "B": "How customers view and think about the brand",
                    "C": "The brand's financial performance",
                    "D": "The brand's history"
                },
                "answer": "B"
            },
            {
                "number": 20,
                "question": "What is brand recognition?",
                "options": {
                    "A": "The brand's legal registration",
                    "B": "The ability of consumers to identify the brand when exposed to it",
                    "C": "The brand's profitability",
                    "D": "The brand's size"
                },
                "answer": "B"
            },
            {
                "number": 21,
                "question": "What is brand recall?",
                "options": {
                    "A": "Remembering the brand's address",
                    "B": "The ability to retrieve the brand from memory when given a product category",
                    "C": "The brand's financial records",
                    "D": "The brand's employee list"
                },
                "answer": "B"
            },
            {
                "number": 22,
                "question": "What is brand personality?",
                "options": {
                    "A": "The CEO's personality",
                    "B": "The set of human characteristics associated with the brand",
                    "C": "The brand's legal personality",
                    "D": "The brand's physical appearance"
                },
                "answer": "B"
            },
            {
                "number": 23,
                "question": "What is brand image?",
                "options": {
                    "A": "The brand's logo",
                    "B": "The impression and perception customers have of the brand",
                    "C": "The brand's financial image",
                    "D": "The brand's physical image"
                },
                "answer": "B"
            },
            {
                "number": 24,
                "question": "What is brand identity?",
                "options": {
                    "A": "The brand's legal identity",
                    "B": "The collection of all elements that a company creates to portray the right image",
                    "C": "The brand's financial identity",
                    "D": "The brand's employee identity"
                },
                "answer": "B"
            },
            {
                "number": 25,
                "question": "What is brand architecture?",
                "options": {
                    "A": "The brand's building design",
                    "B": "The structure of brand relationships within a company's portfolio",
                    "C": "The brand's office architecture",
                    "D": "The brand's website design"
                },
                "answer": "B"
            },
            {
                "number": 26,
                "question": "What is a brand extension?",
                "options": {
                    "A": "Making the brand name longer",
                    "B": "Using an existing brand name for a new product category",
                    "C": "Extending the brand's office hours",
                    "D": "Making the brand's logo bigger"
                },
                "answer": "B"
            },
            {
                "number": 27,
                "question": "What is brand dilution?",
                "options": {
                    "A": "Making the brand weaker",
                    "B": "The weakening of a brand's power due to overuse or misuse",
                    "C": "Diluting the brand's colors",
                    "D": "Reducing the brand's size"
                },
                "answer": "B"
            },
            {
                "number": 28,
                "question": "What is brand revitalization?",
                "options": {
                    "A": "Making the brand younger",
                    "B": "Updating and refreshing a brand to maintain relevance",
                    "C": "Making the brand more expensive",
                    "D": "Changing the brand's location"
                },
                "answer": "B"
            },
            {
                "number": 29,
                "question": "What is brand migration?",
                "options": {
                    "A": "Moving the brand to another country",
                    "B": "The process of moving customers from one brand to another",
                    "C": "Moving the brand's office",
                    "D": "Changing the brand's name"
                },
                "answer": "B"
            },
            {
                "number": 30,
                "question": "What is brand stretching?",
                "options": {
                    "A": "Making the brand logo stretch",
                    "B": "Extending a brand into new product categories",
                    "C": "Stretching the brand's budget",
                    "D": "Making the brand taller"
                },
                "answer": "B"
            },
            {
                "number": 31,
                "question": "What is brand cannibalization?",
                "options": {
                    "A": "Eating the brand",
                    "B": "When a new product takes sales from existing products of the same brand",
                    "C": "Destroying the brand",
                    "D": "Selling the brand"
                },
                "answer": "B"
            },
            {
                "number": 32,
                "question": "What is brand co-creation?",
                "options": {
                    "A": "Creating brands together",
                    "B": "Involving customers in the brand development process",
                    "C": "Creating multiple brands",
                    "D": "Creating brand partnerships"
                },
                "answer": "B"
            },
            {
                "number": 33,
                "question": "What is brand community?",
                "options": {
                    "A": "The brand's neighborhood",
                    "B": "A group of people who share an interest in a brand",
                    "C": "The brand's employees",
                    "D": "The brand's customers"
                },
                "answer": "B"
            },
            {
                "number": 34,
                "question": "What is brand advocacy?",
                "options": {
                    "A": "The brand's legal advocate",
                    "B": "When customers actively promote and recommend the brand",
                    "C": "The brand's spokesperson",
                    "D": "The brand's lawyer"
                },
                "answer": "B"
            },
            {
                "number": 35,
                "question": "What is brand engagement?",
                "options": {
                    "A": "The brand's wedding",
                    "B": "The level of interaction and connection customers have with the brand",
                    "C": "The brand's employment",
                    "D": "The brand's commitment"
                },
                "answer": "B"
            },
            {
                "number": 36,
                "question": "What is brand experience?",
                "options": {
                    "A": "The brand's work experience",
                    "B": "The sum of all interactions a customer has with the brand",
                    "C": "The brand's life experience",
                    "D": "The brand's travel experience"
                },
                "answer": "B"
            },
            {
                "number": 37,
                "question": "What is brand touchpoint?",
                "options": {
                    "A": "The brand's contact point",
                    "B": "Any point of contact between a customer and the brand",
                    "C": "The brand's touch screen",
                    "D": "The brand's physical touch"
                },
                "answer": "B"
            },
            {
                "number": 38,
                "question": "What is brand messaging?",
                "options": {
                    "A": "The brand's text messages",
                    "B": "The communication strategy and content used to convey brand values",
                    "C": "The brand's email messages",
                    "D": "The brand's voice messages"
                },
                "answer": "B"
            },
            {
                "number": 39,
                "question": "What is brand tone?",
                "options": {
                    "A": "The brand's musical tone",
                    "B": "The emotional quality of the brand's communication",
                    "C": "The brand's voice tone",
                    "D": "The brand's sound"
                },
                "answer": "B"
            },
            {
                "number": 40,
                "question": "What is brand voice?",
                "options": {
                    "A": "The brand's speaking voice",
                    "B": "The personality and character of the brand's communication",
                    "C": "The brand's singing voice",
                    "D": "The brand's sound"
                },
                "answer": "B"
            },
            {
                "number": 41,
                "question": "What is brand language?",
                "options": {
                    "A": "The brand's spoken language",
                    "B": "The specific words and phrases used to communicate the brand",
                    "C": "The brand's written language",
                    "D": "The brand's native language"
                },
                "answer": "B"
            },
            {
                "number": 42,
                "question": "What is brand positioning statement?",
                "options": {
                    "A": "The brand's legal statement",
                    "B": "A concise statement that defines the brand's unique place in the market",
                    "C": "The brand's mission statement",
                    "D": "The brand's vision statement"
                },
                "answer": "B"
            },
            {
                "number": 43,
                "question": "What is brand promise?",
                "options": {
                    "A": "The brand's legal promise",
                    "B": "A clear statement of what customers can expect from the brand",
                    "C": "The brand's financial promise",
                    "D": "The brand's employment promise"
                },
                "answer": "B"
            },
            {
                "number": 44,
                "question": "What is brand values?",
                "options": {
                    "A": "The brand's financial value",
                    "B": "The core principles and beliefs that guide the brand",
                    "C": "The brand's market value",
                    "D": "The brand's asset value"
                },
                "answer": "B"
            },
            {
                "number": 45,
                "question": "What is brand mission?",
                "options": {
                    "A": "The brand's secret mission",
                    "B": "The brand's purpose and reason for existence",
                    "C": "The brand's military mission",
                    "D": "The brand's space mission"
                },
                "answer": "B"
            },
            {
                "number": 46,
                "question": "What is brand vision?",
                "options": {
                    "A": "The brand's eyesight",
                    "B": "The brand's future aspirations and goals",
                    "C": "The brand's visual design",
                    "D": "The brand's eye test"
                },
                "answer": "B"
            },
            {
                "number": 47,
                "question": "What is brand strategy?",
                "options": {
                    "A": "The brand's military strategy",
                    "B": "A long-term plan for developing a successful brand",
                    "C": "The brand's business strategy",
                    "D": "The brand's marketing strategy"
                },
                "answer": "B"
            },
            {
                "number": 48,
                "question": "What is brand management?",
                "options": {
                    "A": "Managing the brand's employees",
                    "B": "The process of maintaining and improving brand value",
                    "C": "Managing the brand's finances",
                    "D": "Managing the brand's operations"
                },
                "answer": "B"
            },
            {
                "number": 49,
                "question": "What is brand monitoring?",
                "options": {
                    "A": "Watching the brand",
                    "B": "Tracking and analyzing brand performance and perception",
                    "C": "Monitoring the brand's security",
                    "D": "Monitoring the brand's health"
                },
                "answer": "B"
            },
            {
                "number": 50,
                "question": "What is brand measurement?",
                "options": {
                    "A": "Measuring the brand's size",
                    "B": "Quantifying brand performance and value",
                    "C": "Measuring the brand's weight",
                    "D": "Measuring the brand's height"
                },
                "answer": "B"
            },
            {
                "number": 51,
                "question": "What is brand analytics?",
                "options": {
                    "A": "The brand's mathematical analysis",
                    "B": "The analysis of brand data to improve performance",
                    "C": "The brand's statistical analysis",
                    "D": "The brand's financial analysis"
                },
                "answer": "B"
            },
            {
                "number": 52,
                "question": "What is brand research?",
                "options": {
                    "A": "Researching the brand's history",
                    "B": "Systematic investigation to understand brand performance",
                    "C": "Researching the brand's competitors",
                    "D": "Researching the brand's market"
                },
                "answer": "B"
            },
            {
                "number": 53,
                "question": "What is brand audit?",
                "options": {
                    "A": "The brand's financial audit",
                    "B": "A comprehensive examination of brand performance and assets",
                    "C": "The brand's legal audit",
                    "D": "The brand's tax audit"
                },
                "answer": "B"
            },
            {
                "number": 54,
                "question": "What is brand valuation?",
                "options": {
                    "A": "The brand's property value",
                    "B": "The process of determining the financial value of a brand",
                    "C": "The brand's market value",
                    "D": "The brand's asset value"
                },
                "answer": "B"
            },
            {
                "number": 55,
                "question": "What is brand equity measurement?",
                "options": {
                    "A": "Measuring the brand's financial equity",
                    "B": "Quantifying the value and strength of brand equity",
                    "C": "Measuring the brand's stock equity",
                    "D": "Measuring the brand's property equity"
                },
                "answer": "B"
            },
            {
                "number": 56,
                "question": "What is brand awareness measurement?",
                "options": {
                    "A": "Measuring brand recognition",
                    "B": "Quantifying how well customers know and recognize the brand",
                    "C": "Measuring brand recall",
                    "D": "Measuring brand recognition"
                },
                "answer": "B"
            },
            {
                "number": 57,
                "question": "What is brand loyalty measurement?",
                "options": {
                    "A": "Measuring customer loyalty",
                    "B": "Quantifying customer commitment and repeat purchase behavior",
                    "C": "Measuring employee loyalty",
                    "D": "Measuring brand commitment"
                },
                "answer": "B"
            },
            {
                "number": 58,
                "question": "What is brand perception measurement?",
                "options": {
                    "A": "Measuring brand image",
                    "B": "Quantifying how customers view and think about the brand",
                    "C": "Measuring brand awareness",
                    "D": "Measuring brand recognition"
                },
                "answer": "B"
            },
            {
                "number": 59,
                "question": "What is brand satisfaction measurement?",
                "options": {
                    "A": "Measuring customer satisfaction",
                    "B": "Quantifying how satisfied customers are with the brand",
                    "C": "Measuring employee satisfaction",
                    "D": "Measuring brand happiness"
                },
                "answer": "B"
            },
            {
                "number": 60,
                "question": "What is brand preference measurement?",
                "options": {
                    "A": "Measuring brand choice",
                    "B": "Quantifying customer preference for the brand over competitors",
                    "C": "Measuring brand selection",
                    "D": "Measuring brand choice"
                },
                "answer": "B"
            },
            {
                "number": 61,
                "question": "What is brand consideration measurement?",
                "options": {
                    "A": "Measuring brand thought",
                    "B": "Quantifying whether customers consider the brand when making purchases",
                    "C": "Measuring brand awareness",
                    "D": "Measuring brand recognition"
                },
                "answer": "B"
            },
            {
                "number": 62,
                "question": "What is brand purchase intent measurement?",
                "options": {
                    "A": "Measuring purchase intention",
                    "B": "Quantifying customers' likelihood to purchase the brand",
                    "C": "Measuring buying intention",
                    "D": "Measuring shopping intention"
                },
                "answer": "B"
            },
            {
                "number": 63,
                "question": "What is brand recommendation measurement?",
                "options": {
                    "A": "Measuring brand advice",
                    "B": "Quantifying customers' likelihood to recommend the brand",
                    "C": "Measuring brand suggestion",
                    "D": "Measuring brand referral"
                },
                "answer": "B"
            },
            {
                "number": 64,
                "question": "What is brand advocacy measurement?",
                "options": {
                    "A": "Measuring brand support",
                    "B": "Quantifying customers' active promotion of the brand",
                    "C": "Measuring brand endorsement",
                    "D": "Measuring brand recommendation"
                },
                "answer": "B"
            },
            {
                "number": 65,
                "question": "What is brand engagement measurement?",
                "options": {
                    "A": "Measuring brand interaction",
                    "B": "Quantifying the level of customer interaction with the brand",
                    "C": "Measuring brand involvement",
                    "D": "Measuring brand participation"
                },
                "answer": "B"
            },
            {
                "number": 66,
                "question": "What is brand experience measurement?",
                "options": {
                    "A": "Measuring brand encounters",
                    "B": "Quantifying the quality of customer interactions with the brand",
                    "C": "Measuring brand meetings",
                    "D": "Measuring brand contact"
                },
                "answer": "B"
            },
            {
                "number": 67,
                "question": "What is brand touchpoint measurement?",
                "options": {
                    "A": "Measuring brand contact points",
                    "B": "Quantifying the effectiveness of brand touchpoints",
                    "C": "Measuring brand interaction points",
                    "D": "Measuring brand meeting points"
                },
                "answer": "B"
            },
            {
                "number": 68,
                "question": "What is brand messaging measurement?",
                "options": {
                    "A": "Measuring brand communication",
                    "B": "Quantifying the effectiveness of brand messaging",
                    "C": "Measuring brand advertising",
                    "D": "Measuring brand promotion"
                },
                "answer": "B"
            },
            {
                "number": 69,
                "question": "What is brand tone measurement?",
                "options": {
                    "A": "Measuring brand voice",
                    "B": "Quantifying the emotional quality of brand communication",
                    "C": "Measuring brand sound",
                    "D": "Measuring brand music"
                },
                "answer": "B"
            },
            {
                "number": 70,
                "question": "What is brand voice measurement?",
                "options": {
                    "A": "Measuring brand speaking",
                    "B": "Quantifying the personality of brand communication",
                    "C": "Measuring brand talking",
                    "D": "Measuring brand speech"
                },
                "answer": "B"
            },
            {
                "number": 71,
                "question": "What is brand language measurement?",
                "options": {
                    "A": "Measuring brand words",
                    "B": "Quantifying the effectiveness of brand language",
                    "C": "Measuring brand vocabulary",
                    "D": "Measuring brand terminology"
                },
                "answer": "B"
            },
            {
                "number": 72,
                "question": "What is brand positioning measurement?",
                "options": {
                    "A": "Measuring brand placement",
                    "B": "Quantifying the effectiveness of brand positioning",
                    "C": "Measuring brand location",
                    "D": "Measuring brand position"
                },
                "answer": "B"
            },
            {
                "number": 73,
                "question": "What is brand differentiation measurement?",
                "options": {
                    "A": "Measuring brand differences",
                    "B": "Quantifying how well the brand stands out from competitors",
                    "C": "Measuring brand uniqueness",
                    "D": "Measuring brand distinction"
                },
                "answer": "B"
            },
            {
                "number": 74,
                "question": "What is brand value measurement?",
                "options": {
                    "A": "Measuring brand worth",
                    "B": "Quantifying the value customers place on the brand",
                    "C": "Measuring brand price",
                    "D": "Measuring brand cost"
                },
                "answer": "B"
            },
            {
                "number": 75,
                "question": "What is brand quality measurement?",
                "options": {
                    "A": "Measuring brand excellence",
                    "B": "Quantifying the perceived quality of the brand",
                    "C": "Measuring brand standard",
                    "D": "Measuring brand grade"
                },
                "answer": "B"
            },
            {
                "number": 76,
                "question": "What is brand reliability measurement?",
                "options": {
                    "A": "Measuring brand dependability",
                    "B": "Quantifying how reliable customers find the brand",
                    "C": "Measuring brand trustworthiness",
                    "D": "Measuring brand consistency"
                },
                "answer": "B"
            },
            {
                "number": 77,
                "question": "What is brand trust measurement?",
                "options": {
                    "A": "Measuring brand confidence",
                    "B": "Quantifying how much customers trust the brand",
                    "C": "Measuring brand faith",
                    "D": "Measuring brand belief"
                },
                "answer": "B"
            },
            {
                "number": 78,
                "question": "What is brand credibility measurement?",
                "options": {
                    "A": "Measuring brand believability",
                    "B": "Quantifying how credible customers find the brand",
                    "C": "Measuring brand authenticity",
                    "D": "Measuring brand honesty"
                },
                "answer": "B"
            },
            {
                "number": 79,
                "question": "What is brand authenticity measurement?",
                "options": {
                    "A": "Measuring brand genuineness",
                    "B": "Quantifying how authentic customers perceive the brand",
                    "C": "Measuring brand realness",
                    "D": "Measuring brand truthfulness"
                },
                "answer": "B"
            },
            {
                "number": 80,
                "question": "What is brand transparency measurement?",
                "options": {
                    "A": "Measuring brand openness",
                    "B": "Quantifying how transparent customers find the brand",
                    "C": "Measuring brand clarity",
                    "D": "Measuring brand honesty"
                },
                "answer": "B"
            },
            {
                "number": 81,
                "question": "What is brand responsibility measurement?",
                "options": {
                    "A": "Measuring brand duty",
                    "B": "Quantifying how responsible customers perceive the brand",
                    "C": "Measuring brand obligation",
                    "D": "Measuring brand accountability"
                },
                "answer": "B"
            },
            {
                "number": 82,
                "question": "What is brand sustainability measurement?",
                "options": {
                    "A": "Measuring brand endurance",
                    "B": "Quantifying how sustainable customers perceive the brand",
                    "C": "Measuring brand durability",
                    "D": "Measuring brand longevity"
                },
                "answer": "B"
            },
            {
                "number": 83,
                "question": "What is brand innovation measurement?",
                "options": {
                    "A": "Measuring brand creativity",
                    "B": "Quantifying how innovative customers perceive the brand",
                    "C": "Measuring brand originality",
                    "D": "Measuring brand novelty"
                },
                "answer": "B"
            },
            {
                "number": 84,
                "question": "What is brand leadership measurement?",
                "options": {
                    "A": "Measuring brand guidance",
                    "B": "Quantifying how much of a leader customers perceive the brand",
                    "C": "Measuring brand direction",
                    "D": "Measuring brand management"
                },
                "answer": "B"
            },
            {
                "number": 85,
                "question": "What is brand expertise measurement?",
                "options": {
                    "A": "Measuring brand knowledge",
                    "B": "Quantifying how expert customers perceive the brand",
                    "C": "Measuring brand skill",
                    "D": "Measuring brand competence"
                },
                "answer": "B"
            },
            {
                "number": 86,
                "question": "What is brand authority measurement?",
                "options": {
                    "A": "Measuring brand power",
                    "B": "Quantifying how authoritative customers perceive the brand",
                    "C": "Measuring brand control",
                    "D": "Measuring brand influence"
                },
                "answer": "B"
            },
            {
                "number": 87,
                "question": "What is brand reputation measurement?",
                "options": {
                    "A": "Measuring brand standing",
                    "B": "Quantifying the overall reputation of the brand",
                    "C": "Measuring brand status",
                    "D": "Measuring brand position"
                },
                "answer": "B"
            },
            {
                "number": 88,
                "question": "What is brand image measurement?",
                "options": {
                    "A": "Measuring brand appearance",
                    "B": "Quantifying the image customers have of the brand",
                    "C": "Measuring brand look",
                    "D": "Measuring brand visual"
                },
                "answer": "B"
            },
            {
                "number": 89,
                "question": "What is brand personality measurement?",
                "options": {
                    "A": "Measuring brand character",
                    "B": "Quantifying the personality traits customers associate with the brand",
                    "C": "Measuring brand nature",
                    "D": "Measuring brand temperament"
                },
                "answer": "B"
            },
            {
                "number": 90,
                "question": "What is brand attitude measurement?",
                "options": {
                    "A": "Measuring brand feeling",
                    "B": "Quantifying customers' overall attitude toward the brand",
                    "C": "Measuring brand opinion",
                    "D": "Measuring brand view"
                },
                "answer": "B"
            },
            {
                "number": 91,
                "question": "What is brand emotion measurement?",
                "options": {
                    "A": "Measuring brand feeling",
                    "B": "Quantifying the emotional response customers have to the brand",
                    "C": "Measuring brand sentiment",
                    "D": "Measuring brand mood"
                },
                "answer": "B"
            },
            {
                "number": 92,
                "question": "What is brand connection measurement?",
                "options": {
                    "A": "Measuring brand relationship",
                    "B": "Quantifying the emotional connection customers have with the brand",
                    "C": "Measuring brand bond",
                    "D": "Measuring brand link"
                },
                "answer": "B"
            },
            {
                "number": 93,
                "question": "What is brand relationship measurement?",
                "options": {
                    "A": "Measuring brand connection",
                    "B": "Quantifying the strength of customer relationship with the brand",
                    "C": "Measuring brand bond",
                    "D": "Measuring brand link"
                },
                "answer": "B"
            },
            {
                "number": 94,
                "question": "What is brand intimacy measurement?",
                "options": {
                    "A": "Measuring brand closeness",
                    "B": "Quantifying the level of intimacy customers feel with the brand",
                    "C": "Measuring brand familiarity",
                    "D": "Measuring brand closeness"
                },
                "answer": "B"
            },
            {
                "number": 95,
                "question": "What is brand love measurement?",
                "options": {
                    "A": "Measuring brand affection",
                    "B": "Quantifying the level of love customers have for the brand",
                    "C": "Measuring brand passion",
                    "D": "Measuring brand fondness"
                },
                "answer": "B"
            },
            {
                "number": 96,
                "question": "What is brand passion measurement?",
                "options": {
                    "A": "Measuring brand enthusiasm",
                    "B": "Quantifying the level of passion customers have for the brand",
                    "C": "Measuring brand excitement",
                    "D": "Measuring brand zeal"
                },
                "answer": "B"
            },
            {
                "number": 97,
                "question": "What is brand excitement measurement?",
                "options": {
                    "A": "Measuring brand thrill",
                    "B": "Quantifying the level of excitement customers have for the brand",
                    "C": "Measuring brand enthusiasm",
                    "D": "Measuring brand energy"
                },
                "answer": "B"
            },
            {
                "number": 98,
                "question": "What is brand enthusiasm measurement?",
                "options": {
                    "A": "Measuring brand eagerness",
                    "B": "Quantifying the level of enthusiasm customers have for the brand",
                    "C": "Measuring brand excitement",
                    "D": "Measuring brand zeal"
                },
                "answer": "B"
            },
            {
                "number": 99,
                "question": "What is brand energy measurement?",
                "options": {
                    "A": "Measuring brand power",
                    "B": "Quantifying the level of energy customers associate with the brand",
                    "C": "Measuring brand force",
                    "D": "Measuring brand strength"
                },
                "answer": "B"
            },
            {
                "number": 100,
                "question": "What is brand vitality measurement?",
                "options": {
                    "A": "Measuring brand life",
                    "B": "Quantifying the level of vitality customers associate with the brand",
                    "C": "Measuring brand energy",
                    "D": "Measuring brand vigor"
                },
                "answer": "B"
            },
            {
                "number": 101,
                "question": "What is the primary goal of market research?",
                "options": {
                    "A": "To increase sales immediately",
                    "B": "To gather information about customers, competitors, and market conditions",
                    "C": "To reduce marketing costs",
                    "D": "To copy competitor strategies"
                },
                "answer": "B"
            },
            {
                "number": 102,
                "question": "Which of the following is a type of market research?",
                "options": {
                    "A": "Financial auditing",
                    "B": "Primary and secondary research",
                    "C": "Employee training",
                    "D": "Product manufacturing"
                },
                "answer": "B"
            },
            {
                "number": 103,
                "question": "What is primary research?",
                "options": {
                    "A": "Research done by primary employees",
                    "B": "Original research conducted directly with target audience",
                    "C": "Research from primary sources",
                    "D": "First-time research"
                },
                "answer": "B"
            },
            {
                "number": 104,
                "question": "What is secondary research?",
                "options": {
                    "A": "Second-hand research",
                    "B": "Using existing data and research from other sources",
                    "C": "Backup research",
                    "D": "Alternative research"
                },
                "answer": "B"
            },
            {
                "number": 105,
                "question": "What is a target market?",
                "options": {
                    "A": "A market with targets",
                    "B": "A specific group of customers most likely to buy your product",
                    "C": "A market with goals",
                    "D": "A competitive market"
                },
                "answer": "B"
            },
            {
                "number": 106,
                "question": "What is market segmentation?",
                "options": {
                    "A": "Dividing the market physically",
                    "B": "Dividing a market into smaller groups with similar characteristics",
                    "C": "Splitting market share",
                    "D": "Creating market divisions"
                },
                "answer": "B"
            },
            {
                "number": 107,
                "question": "What is demographic segmentation?",
                "options": {
                    "A": "Segmenting by population",
                    "B": "Dividing market by age, gender, income, education, etc.",
                    "C": "Segmenting by geography",
                    "D": "Dividing by behavior"
                },
                "answer": "B"
            },
            {
                "number": 108,
                "question": "What is psychographic segmentation?",
                "options": {
                    "A": "Segmenting by psychology",
                    "B": "Dividing market by lifestyle, values, personality, interests",
                    "C": "Segmenting by mental health",
                    "D": "Dividing by attitude"
                },
                "answer": "B"
            },
            {
                "number": 109,
                "question": "What is behavioral segmentation?",
                "options": {
                    "A": "Segmenting by actions",
                    "B": "Dividing market by purchasing behavior, usage patterns, brand loyalty",
                    "C": "Segmenting by conduct",
                    "D": "Dividing by performance"
                },
                "answer": "B"
            },
            {
                "number": 110,
                "question": "What is geographic segmentation?",
                "options": {
                    "A": "Segmenting by location",
                    "B": "Dividing market by region, city, climate, population density",
                    "C": "Segmenting by area",
                    "D": "Dividing by territory"
                },
                "answer": "B"
            },
            {
                "number": 111,
                "question": "What is a customer persona?",
                "options": {
                    "A": "A customer's personality",
                    "B": "A detailed profile of your ideal customer",
                    "C": "A customer's character",
                    "D": "A customer's identity"
                },
                "answer": "B"
            },
            {
                "number": 112,
                "question": "What is competitive analysis?",
                "options": {
                    "A": "Analyzing competition",
                    "B": "Evaluating competitors' strengths, weaknesses, and strategies",
                    "C": "Comparing competitors",
                    "D": "Studying rivals"
                },
                "answer": "B"
            },
            {
                "number": 113,
                "question": "What is a SWOT analysis?",
                "options": {
                    "A": "A strategic analysis tool",
                    "B": "Analysis of Strengths, Weaknesses, Opportunities, Threats",
                    "C": "A business analysis",
                    "D": "A market analysis"
                },
                "answer": "B"
            },
            {
                "number": 114,
                "question": "What is market size?",
                "options": {
                    "A": "The physical size of a market",
                    "B": "The total number of potential customers in a market",
                    "C": "The market's dimensions",
                    "D": "The market's volume"
                },
                "answer": "B"
            },
            {
                "number": 115,
                "question": "What is market share?",
                "options": {
                    "A": "Sharing the market",
                    "B": "The percentage of total market sales your company captures",
                    "C": "Dividing the market",
                    "D": "Market distribution"
                },
                "answer": "B"
            },
            {
                "number": 116,
                "question": "What is market penetration?",
                "options": {
                    "A": "Entering the market",
                    "B": "The percentage of potential customers who buy your product",
                    "C": "Market entry",
                    "D": "Market access"
                },
                "answer": "B"
            },
            {
                "number": 117,
                "question": "What is market positioning?",
                "options": {
                    "A": "Positioning in the market",
                    "B": "How your product is perceived relative to competitors",
                    "C": "Market placement",
                    "D": "Market location"
                },
                "answer": "B"
            },
            {
                "number": 118,
                "question": "What is a unique selling proposition (USP)?",
                "options": {
                    "A": "A unique product",
                    "B": "What makes your product different and better than competitors",
                    "C": "A special offer",
                    "D": "A unique feature"
                },
                "answer": "B"
            },
            {
                "number": 119,
                "question": "What is product differentiation?",
                "options": {
                    "A": "Making products different",
                    "B": "Making your product stand out from competitors",
                    "C": "Product variation",
                    "D": "Product distinction"
                },
                "answer": "B"
            },
            {
                "number": 120,
                "question": "What is price positioning?",
                "options": {
                    "A": "Positioning prices",
                    "B": "How your product's price compares to competitors",
                    "C": "Price placement",
                    "D": "Price location"
                },
                "answer": "B"
            },
            {
                "number": 121,
                "question": "What is value proposition?",
                "options": {
                    "A": "A valuable proposition",
                    "B": "The value customers get from your product",
                    "C": "A price proposition",
                    "D": "A benefit proposition"
                },
                "answer": "B"
            },
            {
                "number": 122,
                "question": "What is customer value?",
                "options": {
                    "A": "Customer worth",
                    "B": "The benefits customers receive minus the cost",
                    "C": "Customer price",
                    "D": "Customer benefit"
                },
                "answer": "B"
            },
            {
                "number": 123,
                "question": "What is customer lifetime value (CLV)?",
                "options": {
                    "A": "Customer's total worth",
                    "B": "Total revenue a customer generates over their relationship",
                    "C": "Customer's value",
                    "D": "Customer's worth"
                },
                "answer": "B"
            },
            {
                "number": 124,
                "question": "What is customer acquisition cost (CAC)?",
                "options": {
                    "A": "Cost to acquire customers",
                    "B": "Total cost to acquire a new customer",
                    "C": "Customer cost",
                    "D": "Acquisition expense"
                },
                "answer": "B"
            },
            {
                "number": 125,
                "question": "What is customer retention?",
                "options": {
                    "A": "Keeping customers",
                    "B": "Keeping existing customers from leaving",
                    "C": "Customer loyalty",
                    "D": "Customer maintenance"
                },
                "answer": "B"
            },
            {
                "number": 126,
                "question": "What is customer satisfaction?",
                "options": {
                    "A": "Customer happiness",
                    "B": "How satisfied customers are with your product/service",
                    "C": "Customer contentment",
                    "D": "Customer pleasure"
                },
                "answer": "B"
            },
            {
                "number": 127,
                "question": "What is customer feedback?",
                "options": {
                    "A": "Customer response",
                    "B": "Information from customers about their experience",
                    "C": "Customer opinion",
                    "D": "Customer review"
                },
                "answer": "B"
            },
            {
                "number": 128,
                "question": "What is customer service?",
                "options": {
                    "A": "Serving customers",
                    "B": "Support and assistance provided to customers",
                    "C": "Customer help",
                    "D": "Customer support"
                },
                "answer": "B"
            },
            {
                "number": 129,
                "question": "What is customer experience (CX)?",
                "options": {
                    "A": "Customer journey",
                    "B": "Overall experience customers have with your brand",
                    "C": "Customer interaction",
                    "D": "Customer encounter"
                },
                "answer": "B"
            },
            {
                "number": 130,
                "question": "What is customer journey mapping?",
                "options": {
                    "A": "Mapping customer routes",
                    "B": "Visualizing the customer's experience from first contact to purchase",
                    "C": "Customer path",
                    "D": "Customer route"
                },
                "answer": "B"
            },
            {
                "number": 131,
                "question": "What is customer touchpoint?",
                "options": {
                    "A": "Customer contact",
                    "B": "Any point where customers interact with your brand",
                    "C": "Customer meeting",
                    "D": "Customer contact"
                },
                "answer": "B"
            },
            {
                "number": 132,
                "question": "What is customer onboarding?",
                "options": {
                    "A": "Bringing customers on board",
                    "B": "Process of welcoming and educating new customers",
                    "C": "Customer introduction",
                    "D": "Customer welcome"
                },
                "answer": "B"
            },
            {
                "number": 133,
                "question": "What is customer churn?",
                "options": {
                    "A": "Customer turnover",
                    "B": "Rate at which customers stop using your product",
                    "C": "Customer loss",
                    "D": "Customer departure"
                },
                "answer": "B"
            },
            {
                "number": 134,
                "question": "What is customer loyalty?",
                "options": {
                    "A": "Customer faithfulness",
                    "B": "Customer's commitment to repeatedly purchase from you",
                    "C": "Customer devotion",
                    "D": "Customer allegiance"
                },
                "answer": "B"
            },
            {
                "number": 135,
                "question": "What is customer advocacy?",
                "options": {
                    "A": "Customer support",
                    "B": "When customers actively promote your brand",
                    "C": "Customer recommendation",
                    "D": "Customer endorsement"
                },
                "answer": "B"
            },
            {
                "number": 136,
                "question": "What is customer engagement?",
                "options": {
                    "A": "Customer involvement",
                    "B": "Level of interaction customers have with your brand",
                    "C": "Customer participation",
                    "D": "Customer interaction"
                },
                "answer": "B"
            },
            {
                "number": 137,
                "question": "What is customer relationship management (CRM)?",
                "options": {
                    "A": "Managing customer relationships",
                    "B": "System for managing customer interactions and data",
                    "C": "Customer management",
                    "D": "Relationship management"
                },
                "answer": "B"
            },
            {
                "number": 138,
                "question": "What is customer data?",
                "options": {
                    "A": "Customer information",
                    "B": "Information collected about customers and their behavior",
                    "C": "Customer details",
                    "D": "Customer records"
                },
                "answer": "B"
            },
            {
                "number": 139,
                "question": "What is customer analytics?",
                "options": {
                    "A": "Customer analysis",
                    "B": "Analysis of customer data to improve business decisions",
                    "C": "Customer research",
                    "D": "Customer study"
                },
                "answer": "B"
            },
            {
                "number": 140,
                "question": "What is customer segmentation?",
                "options": {
                    "A": "Dividing customers",
                    "B": "Grouping customers by similar characteristics",
                    "C": "Customer division",
                    "D": "Customer grouping"
                },
                "answer": "B"
            },
            {
                "number": 141,
                "question": "What is customer profiling?",
                "options": {
                    "A": "Customer description",
                    "B": "Creating detailed profiles of customer groups",
                    "C": "Customer analysis",
                    "D": "Customer study"
                },
                "answer": "B"
            },
            {
                "number": 142,
                "question": "What is customer behavior analysis?",
                "options": {
                    "A": "Analyzing customer actions",
                    "B": "Studying how customers interact with your brand",
                    "C": "Customer action study",
                    "D": "Customer behavior study"
                },
                "answer": "B"
            },
            {
                "number": 143,
                "question": "What is customer preference analysis?",
                "options": {
                    "A": "Analyzing customer choices",
                    "B": "Understanding what customers prefer and why",
                    "C": "Customer choice study",
                    "D": "Customer preference study"
                },
                "answer": "B"
            },
            {
                "number": 144,
                "question": "What is customer satisfaction survey?",
                "options": {
                    "A": "Customer happiness survey",
                    "B": "Questionnaire to measure customer satisfaction",
                    "C": "Customer feedback survey",
                    "D": "Customer opinion survey"
                },
                "answer": "B"
            },
            {
                "number": 145,
                "question": "What is customer feedback loop?",
                "options": {
                    "A": "Customer response cycle",
                    "B": "Process of collecting and acting on customer feedback",
                    "C": "Customer input cycle",
                    "D": "Customer response process"
                },
                "answer": "B"
            },
            {
                "number": 146,
                "question": "What is customer support?",
                "options": {
                    "A": "Supporting customers",
                    "B": "Assistance provided to customers with issues",
                    "C": "Customer help",
                    "D": "Customer assistance"
                },
                "answer": "B"
            },
            {
                "number": 147,
                "question": "What is customer success?",
                "options": {
                    "A": "Customer achievement",
                    "B": "Ensuring customers achieve their goals with your product",
                    "C": "Customer accomplishment",
                    "D": "Customer victory"
                },
                "answer": "B"
            },
            {
                "number": 148,
                "question": "What is customer onboarding process?",
                "options": {
                    "A": "Customer introduction process",
                    "B": "Structured process to welcome and educate new customers",
                    "C": "Customer welcome process",
                    "D": "Customer introduction"
                },
                "answer": "B"
            },
            {
                "number": 149,
                "question": "What is customer activation?",
                "options": {
                    "A": "Activating customers",
                    "B": "Getting customers to start using your product",
                    "C": "Customer activation",
                    "D": "Customer engagement"
                },
                "answer": "B"
            },
            {
                "number": 150,
                "question": "What is customer adoption?",
                "options": {
                    "A": "Customer acceptance",
                    "B": "Process of customers accepting and using your product",
                    "C": "Customer acceptance",
                    "D": "Customer uptake"
                },
                "answer": "B"
            },
            {
                "number": 151,
                "question": "What is customer education?",
                "options": {
                    "A": "Teaching customers",
                    "B": "Providing information to help customers use your product",
                    "C": "Customer training",
                    "D": "Customer instruction"
                },
                "answer": "B"
            },
            {
                "number": 152,
                "question": "What is customer training?",
                "options": {
                    "A": "Training customers",
                    "B": "Teaching customers how to use your product effectively",
                    "C": "Customer instruction",
                    "D": "Customer education"
                },
                "answer": "B"
            },
            {
                "number": 153,
                "question": "What is customer documentation?",
                "options": {
                    "A": "Customer records",
                    "B": "Written materials to help customers use your product",
                    "C": "Customer information",
                    "D": "Customer guides"
                },
                "answer": "B"
            },
            {
                "number": 154,
                "question": "What is customer self-service?",
                "options": {
                    "A": "Customer independence",
                    "B": "Allowing customers to solve problems themselves",
                    "C": "Customer autonomy",
                    "D": "Customer independence"
                },
                "answer": "B"
            },
            {
                "number": 155,
                "question": "What is customer knowledge base?",
                "options": {
                    "A": "Customer information",
                    "B": "Centralized resource of information for customers",
                    "C": "Customer database",
                    "D": "Customer information"
                },
                "answer": "B"
            },
            {
                "number": 156,
                "question": "What is customer FAQ?",
                "options": {
                    "A": "Customer questions",
                    "B": "Frequently asked questions and answers for customers",
                    "C": "Customer queries",
                    "D": "Customer questions"
                },
                "answer": "B"
            },
            {
                "number": 157,
                "question": "What is customer ticketing system?",
                "options": {
                    "A": "Customer ticket system",
                    "B": "System for tracking and managing customer support requests",
                    "C": "Customer request system",
                    "D": "Customer support system"
                },
                "answer": "B"
            },
            {
                "number": 158,
                "question": "What is customer escalation?",
                "options": {
                    "A": "Customer promotion",
                    "B": "Moving customer issues to higher-level support",
                    "C": "Customer advancement",
                    "D": "Customer promotion"
                },
                "answer": "B"
            },
            {
                "number": 159,
                "question": "What is customer SLA?",
                "options": {
                    "A": "Customer service level",
                    "B": "Service Level Agreement defining customer service standards",
                    "C": "Customer agreement",
                    "D": "Customer contract"
                },
                "answer": "B"
            },
            {
                "number": 160,
                "question": "What is customer response time?",
                "options": {
                    "A": "Customer reply time",
                    "B": "Time it takes to respond to customer inquiries",
                    "C": "Customer answer time",
                    "D": "Customer reply time"
                },
                "answer": "B"
            },
            {
                "number": 161,
                "question": "What is customer resolution time?",
                "options": {
                    "A": "Customer solution time",
                    "B": "Time it takes to resolve customer issues",
                    "C": "Customer fix time",
                    "D": "Customer solution time"
                },
                "answer": "B"
            },
            {
                "number": 162,
                "question": "What is customer satisfaction score (CSAT)?",
                "options": {
                    "A": "Customer happiness score",
                    "B": "Metric measuring customer satisfaction with service",
                    "C": "Customer contentment score",
                    "D": "Customer pleasure score"
                },
                "answer": "B"
            },
            {
                "number": 163,
                "question": "What is Net Promoter Score (NPS)?",
                "options": {
                    "A": "Net promoter rating",
                    "B": "Metric measuring customer loyalty and likelihood to recommend",
                    "C": "Net promoter score",
                    "D": "Net promoter rating"
                },
                "answer": "B"
            },
            {
                "number": 164,
                "question": "What is customer effort score (CES)?",
                "options": {
                    "A": "Customer work score",
                    "B": "Metric measuring how easy it is for customers to get help",
                    "C": "Customer difficulty score",
                    "D": "Customer work score"
                },
                "answer": "B"
            },
            {
                "number": 165,
                "question": "What is customer sentiment analysis?",
                "options": {
                    "A": "Customer feeling analysis",
                    "B": "Analyzing customer emotions and attitudes",
                    "C": "Customer emotion study",
                    "D": "Customer feeling study"
                },
                "answer": "B"
            },
            {
                "number": 166,
                "question": "What is customer voice of customer (VoC)?",
                "options": {
                    "A": "Customer voice",
                    "B": "Systematic approach to capturing customer feedback and insights",
                    "C": "Customer opinion",
                    "D": "Customer voice"
                },
                "answer": "B"
            },
            {
                "number": 167,
                "question": "What is customer journey analytics?",
                "options": {
                    "A": "Customer path analysis",
                    "B": "Analyzing customer interactions across touchpoints",
                    "C": "Customer route analysis",
                    "D": "Customer path study"
                },
                "answer": "B"
            },
            {
                "number": 168,
                "question": "What is customer behavior tracking?",
                "options": {
                    "A": "Tracking customer actions",
                    "B": "Monitoring how customers interact with your brand",
                    "C": "Customer action monitoring",
                    "D": "Customer behavior monitoring"
                },
                "answer": "B"
            },
            {
                "number": 169,
                "question": "What is customer personalization?",
                "options": {
                    "A": "Customer customization",
                    "B": "Tailoring experiences to individual customer preferences",
                    "C": "Customer individualization",
                    "D": "Customer customization"
                },
                "answer": "B"
            },
            {
                "number": 170,
                "question": "What is customer targeting?",
                "options": {
                    "A": "Targeting customers",
                    "B": "Focusing marketing efforts on specific customer groups",
                    "C": "Customer focus",
                    "D": "Customer targeting"
                },
                "answer": "B"
            },
            {
                "number": 171,
                "question": "What is customer acquisition strategy?",
                "options": {
                    "A": "Customer acquisition plan",
                    "B": "Plan to attract and convert new customers",
                    "C": "Customer acquisition plan",
                    "D": "Customer acquisition strategy"
                },
                "answer": "B"
            },
            {
                "number": 172,
                "question": "What is customer retention strategy?",
                "options": {
                    "A": "Customer retention plan",
                    "B": "Plan to keep existing customers from leaving",
                    "C": "Customer retention plan",
                    "D": "Customer retention strategy"
                },
                "answer": "B"
            },
            {
                "number": 173,
                "question": "What is customer loyalty program?",
                "options": {
                    "A": "Customer loyalty system",
                    "B": "Program to reward and retain loyal customers",
                    "C": "Customer loyalty system",
                    "D": "Customer loyalty program"
                },
                "answer": "B"
            },
            {
                "number": 174,
                "question": "What is customer referral program?",
                "options": {
                    "A": "Customer referral system",
                    "B": "Program encouraging customers to refer others",
                    "C": "Customer referral system",
                    "D": "Customer referral program"
                },
                "answer": "B"
            },
            {
                "number": 175,
                "question": "What is customer reward program?",
                "options": {
                    "A": "Customer reward system",
                    "B": "Program offering rewards for customer actions",
                    "C": "Customer reward system",
                    "D": "Customer reward program"
                },
                "answer": "B"
            },
            {
                "number": 176,
                "question": "What is customer gamification?",
                "options": {
                    "A": "Customer gaming",
                    "B": "Using game elements to engage customers",
                    "C": "Customer gaming",
                    "D": "Customer gamification"
                },
                "answer": "B"
            },
            {
                "number": 177,
                "question": "What is customer community?",
                "options": {
                    "A": "Customer group",
                    "B": "Platform where customers can connect and share",
                    "C": "Customer group",
                    "D": "Customer community"
                },
                "answer": "B"
            },
            {
                "number": 178,
                "question": "What is customer forum?",
                "options": {
                    "A": "Customer discussion",
                    "B": "Online platform for customer discussions and support",
                    "C": "Customer discussion",
                    "D": "Customer forum"
                },
                "answer": "B"
            },
            {
                "number": 179,
                "question": "What is customer user group?",
                "options": {
                    "A": "Customer group",
                    "B": "Group of customers who meet to share experiences",
                    "C": "Customer group",
                    "D": "Customer user group"
                },
                "answer": "B"
            },
            {
                "number": 180,
                "question": "What is customer beta testing?",
                "options": {
                    "A": "Customer testing",
                    "B": "Testing new features with select customers",
                    "C": "Customer testing",
                    "D": "Customer beta testing"
                },
                "answer": "B"
            },
            {
                "number": 181,
                "question": "What is customer feedback session?",
                "options": {
                    "A": "Customer feedback meeting",
                    "B": "Structured session to gather customer input",
                    "C": "Customer feedback meeting",
                    "D": "Customer feedback session"
                },
                "answer": "B"
            },
            {
                "number": 182,
                "question": "What is customer interview?",
                "options": {
                    "A": "Customer conversation",
                    "B": "One-on-one conversation to understand customer needs",
                    "C": "Customer conversation",
                    "D": "Customer interview"
                },
                "answer": "B"
            },
            {
                "number": 183,
                "question": "What is customer focus group?",
                "options": {
                    "A": "Customer group",
                    "B": "Small group discussion to gather customer insights",
                    "C": "Customer group",
                    "D": "Customer focus group"
                },
                "answer": "B"
            },
            {
                "number": 184,
                "question": "What is customer survey?",
                "options": {
                    "A": "Customer questionnaire",
                    "B": "Structured questionnaire to gather customer feedback",
                    "C": "Customer questionnaire",
                    "D": "Customer survey"
                },
                "answer": "B"
            },
            {
                "number": 185,
                "question": "What is customer poll?",
                "options": {
                    "A": "Customer vote",
                    "B": "Quick question to gather customer opinions",
                    "C": "Customer vote",
                    "D": "Customer poll"
                },
                "answer": "B"
            },
            {
                "number": 186,
                "question": "What is customer rating?",
                "options": {
                    "A": "Customer score",
                    "B": "Numerical evaluation of customer satisfaction",
                    "C": "Customer score",
                    "D": "Customer rating"
                },
                "answer": "B"
            },
            {
                "number": 187,
                "question": "What is customer review?",
                "options": {
                    "A": "Customer evaluation",
                    "B": "Written feedback from customers about their experience",
                    "C": "Customer evaluation",
                    "D": "Customer review"
                },
                "answer": "B"
            },
            {
                "number": 188,
                "question": "What is customer testimonial?",
                "options": {
                    "A": "Customer statement",
                    "B": "Positive feedback from satisfied customers",
                    "C": "Customer statement",
                    "D": "Customer testimonial"
                },
                "answer": "B"
            },
            {
                "number": 189,
                "question": "What is customer case study?",
                "options": {
                    "A": "Customer example",
                    "B": "Detailed story of how a customer used your product",
                    "C": "Customer example",
                    "D": "Customer case study"
                },
                "answer": "B"
            },
            {
                "number": 190,
                "question": "What is customer success story?",
                "options": {
                    "A": "Customer achievement",
                    "B": "Story of how your product helped a customer succeed",
                    "C": "Customer achievement",
                    "D": "Customer success story"
                },
                "answer": "B"
            },
            {
                "number": 191,
                "question": "What is customer ROI?",
                "options": {
                    "A": "Customer return",
                    "B": "Return on investment for customer acquisition and retention",
                    "C": "Customer return",
                    "D": "Customer ROI"
                },
                "answer": "B"
            },
            {
                "number": 192,
                "question": "What is customer LTV?",
                "options": {
                    "A": "Customer lifetime value",
                    "B": "Total revenue a customer generates over their relationship",
                    "C": "Customer lifetime value",
                    "D": "Customer LTV"
                },
                "answer": "B"
            },
            {
                "number": 193,
                "question": "What is customer CAC?",
                "options": {
                    "A": "Customer acquisition cost",
                    "B": "Total cost to acquire a new customer",
                    "C": "Customer acquisition cost",
                    "D": "Customer CAC"
                },
                "answer": "B"
            },
            {
                "number": 194,
                "question": "What is customer churn rate?",
                "options": {
                    "A": "Customer loss rate",
                    "B": "Percentage of customers who stop using your product",
                    "C": "Customer loss rate",
                    "D": "Customer churn rate"
                },
                "answer": "B"
            },
            {
                "number": 195,
                "question": "What is customer retention rate?",
                "options": {
                    "A": "Customer keeping rate",
                    "B": "Percentage of customers who continue using your product",
                    "C": "Customer keeping rate",
                    "D": "Customer retention rate"
                },
                "answer": "B"
            },
            {
                "number": 196,
                "question": "What is customer conversion rate?",
                "options": {
                    "A": "Customer change rate",
                    "B": "Percentage of prospects who become customers",
                    "C": "Customer change rate",
                    "D": "Customer conversion rate"
                },
                "answer": "B"
            },
            {
                "number": 197,
                "question": "What is customer engagement rate?",
                "options": {
                    "A": "Customer involvement rate",
                    "B": "Percentage of customers actively interacting with your brand",
                    "C": "Customer involvement rate",
                    "D": "Customer engagement rate"
                },
                "answer": "B"
            },
            {
                "number": 198,
                "question": "What is customer response rate?",
                "options": {
                    "A": "Customer reply rate",
                    "B": "Percentage of customers who respond to communications",
                    "C": "Customer reply rate",
                    "D": "Customer response rate"
                },
                "answer": "B"
            },
            {
                "number": 199,
                "question": "What is customer open rate?",
                "options": {
                    "A": "Customer opening rate",
                    "B": "Percentage of customers who open your emails",
                    "C": "Customer opening rate",
                    "D": "Customer open rate"
                },
                "answer": "B"
            },
            {
                "number": 200,
                "question": "What is customer click-through rate (CTR)?",
                "options": {
                    "A": "Customer click rate",
                    "B": "Percentage of customers who click on links in communications",
                    "C": "Customer click rate",
                    "D": "Customer click-through rate"
                },
                "answer": "B"
            },
            {
                "number": 201,
                "question": "What is entrepreneurship?",
                "options": {
                    "A": "Starting a business",
                    "B": "The process of creating, developing, and managing a business venture",
                    "C": "Making money",
                    "D": "Running a company"
                },
                "answer": "B"
            },
            {
                "number": 202,
                "question": "What is an entrepreneur?",
                "options": {
                    "A": "A business owner",
                    "B": "A person who starts and manages a business venture",
                    "C": "A manager",
                    "D": "A CEO"
                },
                "answer": "B"
            },
            {
                "number": 203,
                "question": "What is innovation in entrepreneurship?",
                "options": {
                    "A": "Creating new products",
                    "B": "Introducing new ideas, methods, or products",
                    "C": "Improving existing products",
                    "D": "Marketing strategies"
                },
                "answer": "B"
            },
            {
                "number": 204,
                "question": "What is a startup?",
                "options": {
                    "A": "A new company",
                    "B": "A newly established business with high growth potential",
                    "C": "A small business",
                    "D": "A company"
                },
                "answer": "B"
            },
            {
                "number": 205,
                "question": "What is a business model?",
                "options": {
                    "A": "A business plan",
                    "B": "How a company creates, delivers, and captures value",
                    "C": "A business strategy",
                    "D": "A business structure"
                },
                "answer": "B"
            },
            {
                "number": 206,
                "question": "What is a value proposition?",
                "options": {
                    "A": "A value offer",
                    "B": "The unique value a product or service provides to customers",
                    "C": "A price offer",
                    "D": "A product benefit"
                },
                "answer": "B"
            },
            {
                "number": 207,
                "question": "What is market opportunity?",
                "options": {
                    "A": "A market chance",
                    "B": "A favorable set of circumstances for creating a new business",
                    "C": "A market gap",
                    "D": "A business opportunity"
                },
                "answer": "B"
            },
            {
                "number": 208,
                "question": "What is competitive advantage?",
                "options": {
                    "A": "Competitive edge",
                    "B": "A unique advantage over competitors",
                    "C": "Competitive strength",
                    "D": "Competitive benefit"
                },
                "answer": "B"
            },
            {
                "number": 209,
                "question": "What is a business plan?",
                "options": {
                    "A": "A business document",
                    "B": "A written document describing business strategy and financial projections",
                    "C": "A business proposal",
                    "D": "A business outline"
                },
                "answer": "B"
            },
            {
                "number": 210,
                "question": "What is funding in entrepreneurship?",
                "options": {
                    "A": "Money for business",
                    "B": "Financial resources to start or grow a business",
                    "C": "Business investment",
                    "D": "Business capital"
                },
                "answer": "B"
            },
            {
                "number": 211,
                "question": "What is bootstrapping?",
                "options": {
                    "A": "Starting with nothing",
                    "B": "Starting a business with minimal external funding",
                    "C": "Self-funding",
                    "D": "Personal investment"
                },
                "answer": "B"
            },
            {
                "number": 212,
                "question": "What is venture capital?",
                "options": {
                    "A": "Venture funding",
                    "B": "Investment in high-growth potential startups",
                    "C": "Business investment",
                    "D": "Startup funding"
                },
                "answer": "B"
            },
            {
                "number": 213,
                "question": "What is angel investment?",
                "options": {
                    "A": "Angel funding",
                    "B": "Investment from wealthy individuals in early-stage companies",
                    "C": "Personal investment",
                    "D": "Individual funding"
                },
                "answer": "B"
            },
            {
                "number": 214,
                "question": "What is crowdfunding?",
                "options": {
                    "A": "Crowd funding",
                    "B": "Raising funds from many people via online platforms",
                    "C": "Public funding",
                    "D": "Mass funding"
                },
                "answer": "B"
            },
            {
                "number": 215,
                "question": "What is a pitch deck?",
                "options": {
                    "A": "A presentation",
                    "B": "A brief presentation to investors about your business",
                    "C": "A business presentation",
                    "D": "An investor presentation"
                },
                "answer": "B"
            },
            {
                "number": 216,
                "question": "What is scalability?",
                "options": {
                    "A": "Ability to scale",
                    "B": "Ability to grow without proportional increase in costs",
                    "C": "Growth potential",
                    "D": "Expansion ability"
                },
                "answer": "B"
            },
            {
                "number": 217,
                "question": "What is a minimum viable product (MVP)?",
                "options": {
                    "A": "A basic product",
                    "B": "A product with minimum features to test market demand",
                    "C": "A simple product",
                    "D": "A test product"
                },
                "answer": "B"
            },
            {
                "number": 218,
                "question": "What is product-market fit?",
                "options": {
                    "A": "Product market match",
                    "B": "When a product satisfies strong market demand",
                    "C": "Market fit",
                    "D": "Product fit"
                },
                "answer": "B"
            },
            {
                "number": 219,
                "question": "What is customer validation?",
                "options": {
                    "A": "Customer verification",
                    "B": "Confirming that customers want your product",
                    "C": "Customer approval",
                    "D": "Customer confirmation"
                },
                "answer": "B"
            },
            {
                "number": 220,
                "question": "What is a pivot?",
                "options": {
                    "A": "A change",
                    "B": "A fundamental change in business strategy",
                    "C": "A strategy change",
                    "D": "A business change"
                },
                "answer": "B"
            },
            {
                "number": 221,
                "question": "What is lean startup methodology?",
                "options": {
                    "A": "Lean methodology",
                    "B": "A methodology for developing businesses and products efficiently",
                    "C": "Startup methodology",
                    "D": "Business methodology"
                },
                "answer": "B"
            },
            {
                "number": 222,
                "question": "What is rapid prototyping?",
                "options": {
                    "A": "Quick prototyping",
                    "B": "Quickly creating and testing product versions",
                    "C": "Fast prototyping",
                    "D": "Quick testing"
                },
                "answer": "B"
            },
            {
                "number": 223,
                "question": "What is iteration?",
                "options": {
                    "A": "Repeating",
                    "B": "Repeatedly improving a product based on feedback",
                    "C": "Repeating process",
                    "D": "Continuous improvement"
                },
                "answer": "B"
            },
            {
                "number": 224,
                "question": "What is a unicorn startup?",
                "options": {
                    "A": "A mythical startup",
                    "B": "A startup valued at over $1 billion",
                    "C": "A rare startup",
                    "D": "A successful startup"
                },
                "answer": "B"
            },
            {
                "number": 225,
                "question": "What is an exit strategy?",
                "options": {
                    "A": "Exit plan",
                    "B": "Plan for how founders will leave the business",
                    "C": "Exit plan",
                    "D": "Departure strategy"
                },
                "answer": "B"
            },
            {
                "number": 226,
                "question": "What is an IPO?",
                "options": {
                    "A": "Initial public offering",
                    "B": "First sale of stock to the public",
                    "C": "Public offering",
                    "D": "Stock offering"
                },
                "answer": "B"
            },
            {
                "number": 227,
                "question": "What is acquisition?",
                "options": {
                    "A": "Buying",
                    "B": "One company buying another company",
                    "C": "Company purchase",
                    "D": "Business purchase"
                },
                "answer": "B"
            },
            {
                "number": 228,
                "question": "What is a merger?",
                "options": {
                    "A": "Combining",
                    "B": "Two companies combining to form one",
                    "C": "Company combination",
                    "D": "Business combination"
                },
                "answer": "B"
            },
            {
                "number": 229,
                "question": "What is intellectual property?",
                "options": {
                    "A": "Intellectual assets",
                    "B": "Creations of the mind that can be legally protected",
                    "C": "Intellectual assets",
                    "D": "Creative property"
                },
                "answer": "B"
            },
            {
                "number": 230,
                "question": "What is a patent?",
                "options": {
                    "A": "A legal document",
                    "B": "Exclusive rights to an invention for a limited time",
                    "C": "A legal right",
                    "D": "An invention right"
                },
                "answer": "B"
            },
            {
                "number": 231,
                "question": "What is a trademark?",
                "options": {
                    "A": "A brand mark",
                    "B": "A symbol, word, or phrase legally registered for exclusive use",
                    "C": "A brand symbol",
                    "D": "A brand mark"
                },
                "answer": "B"
            },
            {
                "number": 232,
                "question": "What is copyright?",
                "options": {
                    "A": "Copy right",
                    "B": "Exclusive rights to original creative works",
                    "C": "Creative rights",
                    "D": "Original rights"
                },
                "answer": "B"
            },
            {
                "number": 233,
                "question": "What is a trade secret?",
                "options": {
                    "A": "A secret",
                    "B": "Confidential business information that provides competitive advantage",
                    "C": "A business secret",
                    "D": "A company secret"
                },
                "answer": "B"
            },
            {
                "number": 234,
                "question": "What is due diligence?",
                "options": {
                    "A": "Careful research",
                    "B": "Thorough investigation before making a business decision",
                    "C": "Careful investigation",
                    "D": "Thorough research"
                },
                "answer": "B"
            },
            {
                "number": 235,
                "question": "What is a term sheet?",
                "options": {
                    "A": "A document",
                    "B": "A non-binding agreement outlining terms of investment",
                    "C": "A term document",
                    "D": "A term agreement"
                },
                "answer": "B"
            },
            {
                "number": 236,
                "question": "What is equity?",
                "options": {
                    "A": "Ownership",
                    "B": "Ownership interest in a company",
                    "C": "Company ownership",
                    "D": "Business ownership"
                },
                "answer": "B"
            },
            {
                "number": 237,
                "question": "What is dilution?",
                "options": {
                    "A": "Reducing",
                    "B": "Reduction in ownership percentage when new shares are issued",
                    "C": "Ownership reduction",
                    "D": "Share reduction"
                },
                "answer": "B"
            },
            {
                "number": 238,
                "question": "What is a board of directors?",
                "options": {
                    "A": "A board",
                    "B": "Group elected to represent shareholders and oversee company",
                    "C": "A company board",
                    "D": "A business board"
                },
                "answer": "B"
            },
            {
                "number": 239,
                "question": "What is corporate governance?",
                "options": {
                    "A": "Corporate management",
                    "B": "System of rules and practices for company management",
                    "C": "Corporate rules",
                    "D": "Company governance"
                },
                "answer": "B"
            },
            {
                "number": 240,
                "question": "What is compliance?",
                "options": {
                    "A": "Following rules",
                    "B": "Adhering to laws, regulations, and standards",
                    "C": "Rule following",
                    "D": "Regulation following"
                },
                "answer": "B"
            },
            {
                "number": 241,
                "question": "What is risk management?",
                "options": {
                    "A": "Risk control",
                    "B": "Identifying and minimizing potential business risks",
                    "C": "Risk control",
                    "D": "Risk handling"
                },
                "answer": "B"
            },
            {
                "number": 242,
                "question": "What is liability?",
                "options": {
                    "A": "Responsibility",
                    "B": "Legal responsibility for debts or obligations",
                    "C": "Legal responsibility",
                    "D": "Business responsibility"
                },
                "answer": "B"
            },
            {
                "number": 243,
                "question": "What is insurance?",
                "options": {
                    "A": "Protection",
                    "B": "Financial protection against losses",
                    "C": "Risk protection",
                    "D": "Loss protection"
                },
                "answer": "B"
            },
            {
                "number": 244,
                "question": "What is a contract?",
                "options": {
                    "A": "An agreement",
                    "B": "Legally binding agreement between parties",
                    "C": "A legal agreement",
                    "D": "A business agreement"
                },
                "answer": "B"
            },
            {
                "number": 245,
                "question": "What is negotiation?",
                "options": {
                    "A": "Bargaining",
                    "B": "Process of reaching agreement between parties",
                    "C": "Bargaining process",
                    "D": "Agreement process"
                },
                "answer": "B"
            },
            {
                "number": 246,
                "question": "What is a partnership?",
                "options": {
                    "A": "A collaboration",
                    "B": "Business relationship between two or more parties",
                    "C": "A business partnership",
                    "D": "A collaboration"
                },
                "answer": "B"
            },
            {
                "number": 247,
                "question": "What is a joint venture?",
                "options": {
                    "A": "Joint business",
                    "B": "Business arrangement between two or more parties",
                    "C": "Joint business",
                    "D": "Combined venture"
                },
                "answer": "B"
            },
            {
                "number": 248,
                "question": "What is franchising?",
                "options": {
                    "A": "Franchise business",
                    "B": "Licensing business model to independent operators",
                    "C": "Franchise model",
                    "D": "License business"
                },
                "answer": "B"
            },
            {
                "number": 249,
                "question": "What is licensing?",
                "options": {
                    "A": "License granting",
                    "B": "Granting permission to use intellectual property",
                    "C": "License granting",
                    "D": "Permission granting"
                },
                "answer": "B"
            },
            {
                "number": 250,
                "question": "What is outsourcing?",
                "options": {
                    "A": "External work",
                    "B": "Hiring external companies to perform business functions",
                    "C": "External hiring",
                    "D": "External services"
                },
                "answer": "B"
            },
            {
                "number": 251,
                "question": "What is supply chain management?",
                "options": {
                    "A": "Supply management",
                    "B": "Managing flow of goods and services from supplier to customer",
                    "C": "Supply management",
                    "D": "Chain management"
                },
                "answer": "B"
            },
            {
                "number": 252,
                "question": "What is inventory management?",
                "options": {
                    "A": "Inventory control",
                    "B": "Managing stock levels and product flow",
                    "C": "Inventory control",
                    "D": "Stock management"
                },
                "answer": "B"
            },
            {
                "number": 253,
                "question": "What is quality control?",
                "options": {
                    "A": "Quality management",
                    "B": "Ensuring products meet quality standards",
                    "C": "Quality management",
                    "D": "Quality assurance"
                },
                "answer": "B"
            },
            {
                "number": 254,
                "question": "What is total quality management (TQM)?",
                "options": {
                    "A": "Quality management",
                    "B": "Management approach focused on quality improvement",
                    "C": "Quality management",
                    "D": "Quality approach"
                },
                "answer": "B"
            },
            {
                "number": 255,
                "question": "What is Six Sigma?",
                "options": {
                    "A": "Quality method",
                    "B": "Methodology for improving quality and reducing defects",
                    "C": "Quality method",
                    "D": "Quality methodology"
                },
                "answer": "B"
            },
            {
                "number": 256,
                "question": "What is lean manufacturing?",
                "options": {
                    "A": "Lean production",
                    "B": "Production methodology focused on eliminating waste",
                    "C": "Lean production",
                    "D": "Efficient manufacturing"
                },
                "answer": "B"
            },
            {
                "number": 257,
                "question": "What is just-in-time (JIT)?",
                "options": {
                    "A": "Just in time",
                    "B": "Production system that produces items as needed",
                    "C": "Just in time",
                    "D": "Timely production"
                },
                "answer": "B"
            },
            {
                "number": 258,
                "question": "What is kaizen?",
                "options": {
                    "A": "Continuous improvement",
                    "B": "Japanese philosophy of continuous improvement",
                    "C": "Continuous improvement",
                    "D": "Improvement philosophy"
                },
                "answer": "B"
            },
            {
                "number": 259,
                "question": "What is benchmarking?",
                "options": {
                    "A": "Performance comparison",
                    "B": "Comparing performance against industry standards",
                    "C": "Performance comparison",
                    "D": "Standard comparison"
                },
                "answer": "B"
            },
            {
                "number": 260,
                "question": "What is best practice?",
                "options": {
                    "A": "Best method",
                    "B": "Method or technique that delivers superior results",
                    "C": "Best method",
                    "D": "Superior method"
                },
                "answer": "B"
            },
            {
                "number": 261,
                "question": "What is continuous improvement?",
                "options": {
                    "A": "Ongoing improvement",
                    "B": "Ongoing effort to improve products, services, or processes",
                    "C": "Ongoing improvement",
                    "D": "Continuous enhancement"
                },
                "answer": "B"
            },
            {
                "number": 262,
                "question": "What is process improvement?",
                "options": {
                    "A": "Process enhancement",
                    "B": "Making business processes more efficient and effective",
                    "C": "Process enhancement",
                    "D": "Process optimization"
                },
                "answer": "B"
            },
            {
                "number": 263,
                "question": "What is workflow optimization?",
                "options": {
                    "A": "Workflow improvement",
                    "B": "Improving the efficiency of work processes",
                    "C": "Workflow improvement",
                    "D": "Process optimization"
                },
                "answer": "B"
            },
            {
                "number": 264,
                "question": "What is automation?",
                "options": {
                    "A": "Automatic process",
                    "B": "Using technology to perform tasks without human intervention",
                    "C": "Automatic process",
                    "D": "Technology automation"
                },
                "answer": "B"
            },
            {
                "number": 265,
                "question": "What is digital transformation?",
                "options": {
                    "A": "Digital change",
                    "B": "Integrating digital technology into all areas of business",
                    "C": "Digital change",
                    "D": "Technology integration"
                },
                "answer": "B"
            },
            {
                "number": 266,
                "question": "What is e-commerce?",
                "options": {
                    "A": "Electronic commerce",
                    "B": "Buying and selling goods and services online",
                    "C": "Electronic commerce",
                    "D": "Online business"
                },
                "answer": "B"
            },
            {
                "number": 267,
                "question": "What is m-commerce?",
                "options": {
                    "A": "Mobile commerce",
                    "B": "Buying and selling through mobile devices",
                    "C": "Mobile commerce",
                    "D": "Mobile business"
                },
                "answer": "B"
            },
            {
                "number": 268,
                "question": "What is social commerce?",
                "options": {
                    "A": "Social business",
                    "B": "Buying and selling through social media platforms",
                    "C": "Social business",
                    "D": "Social media commerce"
                },
                "answer": "B"
            },
            {
                "number": 269,
                "question": "What is omnichannel retailing?",
                "options": {
                    "A": "Multi-channel retail",
                    "B": "Providing seamless shopping experience across all channels",
                    "C": "Multi-channel retail",
                    "D": "Integrated retail"
                },
                "answer": "B"
            },
            {
                "number": 270,
                "question": "What is dropshipping?",
                "options": {
                    "A": "Direct shipping",
                    "B": "Selling products without holding inventory",
                    "C": "Direct shipping",
                    "D": "Inventory-free selling"
                },
                "answer": "B"
            },
            {
                "number": 271,
                "question": "What is subscription business model?",
                "options": {
                    "A": "Subscription model",
                    "B": "Business model based on recurring payments",
                    "C": "Subscription model",
                    "D": "Recurring model"
                },
                "answer": "B"
            },
            {
                "number": 272,
                "question": "What is freemium model?",
                "options": {
                    "A": "Free model",
                    "B": "Business model offering basic service free, premium features paid",
                    "C": "Free model",
                    "D": "Premium model"
                },
                "answer": "B"
            },
            {
                "number": 273,
                "question": "What is platform business model?",
                "options": {
                    "A": "Platform model",
                    "B": "Business model connecting different user groups",
                    "C": "Platform model",
                    "D": "Connection model"
                },
                "answer": "B"
            },
            {
                "number": 274,
                "question": "What is marketplace business model?",
                "options": {
                    "A": "Marketplace model",
                    "B": "Platform connecting buyers and sellers",
                    "C": "Marketplace model",
                    "D": "Trading platform"
                },
                "answer": "B"
            },
            {
                "number": 275,
                "question": "What is sharing economy?",
                "options": {
                    "A": "Shared economy",
                    "B": "Economic model based on sharing resources",
                    "C": "Shared economy",
                    "D": "Resource sharing"
                },
                "answer": "B"
            },
            {
                "number": 276,
                "question": "What is gig economy?",
                "options": {
                    "A": "Gig work",
                    "B": "Labor market characterized by short-term contracts",
                    "C": "Gig work",
                    "D": "Short-term work"
                },
                "answer": "B"
            },
            {
                "number": 277,
                "question": "What is circular economy?",
                "options": {
                    "A": "Circular model",
                    "B": "Economic system focused on resource efficiency and sustainability",
                    "C": "Circular model",
                    "D": "Sustainable economy"
                },
                "answer": "B"
            },
            {
                "number": 278,
                "question": "What is sustainable business?",
                "options": {
                    "A": "Sustainable company",
                    "B": "Business that considers environmental and social impact",
                    "C": "Sustainable company",
                    "D": "Green business"
                },
                "answer": "B"
            },
            {
                "number": 279,
                "question": "What is corporate social responsibility (CSR)?",
                "options": {
                    "A": "Social responsibility",
                    "B": "Company's commitment to social and environmental well-being",
                    "C": "Social responsibility",
                    "D": "Corporate responsibility"
                },
                "answer": "B"
            },
            {
                "number": 280,
                "question": "What is triple bottom line?",
                "options": {
                    "A": "Three bottom lines",
                    "B": "Measuring success by profit, people, and planet",
                    "C": "Three bottom lines",
                    "D": "Triple measurement"
                },
                "answer": "B"
            },
            {
                "number": 281,
                "question": "What is impact investing?",
                "options": {
                    "A": "Impact investment",
                    "B": "Investing for both financial return and social impact",
                    "C": "Impact investment",
                    "D": "Social investment"
                },
                "answer": "B"
            },
            {
                "number": 282,
                "question": "What is social entrepreneurship?",
                "options": {
                    "A": "Social business",
                    "B": "Entrepreneurship focused on solving social problems",
                    "C": "Social business",
                    "D": "Social enterprise"
                },
                "answer": "B"
            },
            {
                "number": 283,
                "question": "What is a social enterprise?",
                "options": {
                    "A": "Social company",
                    "B": "Business that addresses social issues while making profit",
                    "C": "Social company",
                    "D": "Social business"
                },
                "answer": "B"
            },
            {
                "number": 284,
                "question": "What is B Corporation?",
                "options": {
                    "A": "B Corp",
                    "B": "Certification for businesses meeting social and environmental standards",
                    "C": "B Corp",
                    "D": "Social certification"
                },
                "answer": "B"
            },
            {
                "number": 285,
                "question": "What is fair trade?",
                "options": {
                    "A": "Fair trading",
                    "B": "Trading partnership based on dialogue, transparency, and respect",
                    "C": "Fair trading",
                    "D": "Ethical trade"
                },
                "answer": "B"
            },
            {
                "number": 286,
                "question": "What is green business?",
                "options": {
                    "A": "Green company",
                    "B": "Business that operates in environmentally friendly ways",
                    "C": "Green company",
                    "D": "Environmental business"
                },
                "answer": "B"
            },
            {
                "number": 287,
                "question": "What is carbon footprint?",
                "options": {
                    "A": "Carbon impact",
                    "B": "Total greenhouse gas emissions caused by an organization",
                    "C": "Carbon impact",
                    "D": "Environmental impact"
                },
                "answer": "B"
            },
            {
                "number": 288,
                "question": "What is carbon offsetting?",
                "options": {
                    "A": "Carbon compensation",
                    "B": "Compensating for carbon emissions through environmental projects",
                    "C": "Carbon compensation",
                    "D": "Emission offsetting"
                },
                "answer": "B"
            },
            {
                "number": 289,
                "question": "What is renewable energy?",
                "options": {
                    "A": "Renewable power",
                    "B": "Energy from sources that are naturally replenished",
                    "C": "Renewable power",
                    "D": "Sustainable energy"
                },
                "answer": "B"
            },
            {
                "number": 290,
                "question": "What is energy efficiency?",
                "options": {
                    "A": "Energy saving",
                    "B": "Using less energy to perform the same function",
                    "C": "Energy saving",
                    "D": "Efficient energy use"
                },
                "answer": "B"
            },
            {
                "number": 291,
                "question": "What is waste reduction?",
                "options": {
                    "A": "Waste decrease",
                    "B": "Minimizing waste generation in business operations",
                    "C": "Waste decrease",
                    "D": "Waste minimization"
                },
                "answer": "B"
            },
            {
                "number": 292,
                "question": "What is recycling?",
                "options": {
                    "A": "Reusing materials",
                    "B": "Converting waste materials into new products",
                    "C": "Reusing materials",
                    "D": "Material conversion"
                },
                "answer": "B"
            },
            {
                "number": 293,
                "question": "What is upcycling?",
                "options": {
                    "A": "Upgrade cycling",
                    "B": "Converting waste materials into products of higher value",
                    "C": "Upgrade cycling",
                    "D": "Value conversion"
                },
                "answer": "B"
            },
            {
                "number": 294,
                "question": "What is biodegradable?",
                "options": {
                    "A": "Natural breakdown",
                    "B": "Capable of being broken down by natural processes",
                    "C": "Natural breakdown",
                    "D": "Natural decomposition"
                },
                "answer": "B"
            },
            {
                "number": 295,
                "question": "What is organic certification?",
                "options": {
                    "A": "Organic approval",
                    "B": "Certification that products meet organic standards",
                    "C": "Organic approval",
                    "D": "Organic verification"
                },
                "answer": "B"
            },
            {
                "number": 296,
                "question": "What is local sourcing?",
                "options": {
                    "A": "Local supply",
                    "B": "Obtaining materials and products from nearby sources",
                    "C": "Local supply",
                    "D": "Local procurement"
                },
                "answer": "B"
            },
            {
                "number": 297,
                "question": "What is ethical sourcing?",
                "options": {
                    "A": "Ethical supply",
                    "B": "Obtaining materials in socially and environmentally responsible ways",
                    "C": "Ethical supply",
                    "D": "Responsible sourcing"
                },
                "answer": "B"
            },
            {
                "number": 298,
                "question": "What is supply chain transparency?",
                "options": {
                    "A": "Supply visibility",
                    "B": "Openness about supply chain practices and sources",
                    "C": "Supply visibility",
                    "D": "Supply openness"
                },
                "answer": "B"
            },
            {
                "number": 299,
                "question": "What is traceability?",
                "options": {
                    "A": "Tracking ability",
                    "B": "Ability to track products through the supply chain",
                    "C": "Tracking ability",
                    "D": "Product tracking"
                },
                "answer": "B"
            },
            {
                "number": 300,
                "question": "What is blockchain in business?",
                "options": {
                    "A": "Blockchain technology",
                    "B": "Distributed ledger technology for secure, transparent transactions",
                    "C": "Blockchain technology",
                    "D": "Digital ledger"
                },
                "answer": "B"
            }
        ];
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EntrepreneurshipQuiz();
});

// Add slideInRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 