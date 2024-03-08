class Play extends Phaser.Scene {
  constructor() {
    super("Play");
    this.movies = [
      // Based on mood (きぶんはどうですか?)
      {
        title: "Alice in Wonderland",
        tags: ["うれしい", "アクション", "はれ"],
      },
      { title: "Singin' in the Rain", tags: ["かなしい", "ロマンス", "あめ"] },
      {
        title: "Interstellar",
        tags: ["わくわくする", "ファンタジー", "くもり"],
      },
      { title: "A Quiet Place", tags: ["こわい", "ホラー", "ゆき"] },

      // Based on company (えいがを見る時、だれと見たいですか？)
      { title: "Cast Away", tags: ["一人で", "つまらない"] },
      { title: "Superbad", tags: ["ともだちと", "コメディ", "楽しい"] },
      {
        title: "The Incredibles ",
        tags: ["かぞくと", "ファンタジー", "まあまあ"],
      },
      { title: "The Notebook", tags: ["こいびとと", "ロマンス", "いそがしい"] },

      // Based on today's weather and work/school situation (今日のてんきは？, しごとや学校はどうですか？)
      { title: "Top Gun", tags: ["はれ", "いそがしい", "アクション"] },
      {
        title: "The Secret Life of Walter Mitty",
        tags: ["くもり", "まあまあ", "コメディ"],
      },
    ];

    this.questionTextObjects = []; // To keep track of question and choice text objects for removal

    this.answers = []; // To store player's answers
  }

  preload() {
    this.load.image("surfy", "/assets/surfy.png");
    // Assuming button images are preloaded
    this.load.image("button", "/assets/button.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xdddddd);
    this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "surfy")
      .setScale(0.5);

    // Start the questionnaire
    this.displayQuestion(0);
  }

  displayQuestion(questionIndex) {
    // Clear previous question and choices
    this.questionTextObjects.forEach((obj) => obj.destroy()); // Destroy previous text objects
    this.questionTextObjects = []; // Reset the array for the new question

    const questions = [
      {
        text: "きぶんはどうですか?",
        choices: ["うれしい", "かなしい", "わくわくする", "こわい"],
      },
      {
        text: "どんなえいががすきですか？",
        choices: ["アクション", "ロマンス", "コメディ", "ファンタジー"],
      },
      {
        text: "今日のてんきは？",
        choices: ["はれ", "くもり", "あめ", "ゆき"],
      },
      {
        text: "えいがを見る時、だれと見たいですか？ ",
        choices: ["一人で", "ともだちと", "かぞくと", "こいびとと"],
      },
      {
        text: "しごとや学校はどうですか？",
        choices: ["いそがしい", "楽しい", "つまらない", "まあまあ"],
      },
    ];

    if (questionIndex < questions.length) {
      let question = questions[questionIndex];
      let questionText = this.add.text(100, 50, question.text, {
        fontSize: "24px",
        color: "#000",
      });
      this.questionTextObjects.push(questionText);

      question.choices.forEach((choice, index) => {
        let buttonY = 150 + 50 * index;
        let button = this.add
          .sprite(100, buttonY, "button")
          .setInteractive()
          .setScale(0.2)
          .setOrigin(0.2, 0.5);
        let choiceText = this.add.text(100, 140 + 50 * index, choice, {
          fontSize: "20px",
          color: "#000",
        });
        this.questionTextObjects.push(choiceText);

        button.on("pointerdown", () => {
          this.answers.push(choice);
          if (questionIndex + 1 < questions.length) {
            this.displayQuestion(questionIndex + 1);
          } else {
            this.recommendMovie();
          }
          button.destroy(); // Remove the button after it's clicked
        });
      });
    } else {
      this.recommendMovie();
    }
  }

  recommendMovie() {
    let recommendedMovie = null;
    let highestScore = 0;

    this.movies.forEach((movie) => {
      let score = movie.tags.filter((tag) => this.answers.includes(tag)).length;
      if (score > highestScore) {
        highestScore = score;
        recommendedMovie = movie;
      }
    });

    if (recommendedMovie) {
      this.add.text(100, 100, `We recommend: ${recommendedMovie.title}`, {
        fontSize: "32px",
        color: "#000",
      });
    }
  }

  init(data) {
    if (data.answers) {
      this.answers = data.answers;
    }
  }
}
