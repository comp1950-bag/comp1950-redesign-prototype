$(document).ready(function(){

	function createQuizz(targetId, quizzContent){

		/* 
		<div id="quizz-container">
			<p>question</p>
			<hidden id="question-id" value="question-id"/>
			<form id="quizz-answers">
			  	<input type="radio" name="answers" value="male"> Male<br>
			  	<input type="radio" name="answers" value="female"> Female<br>
			  	<input type="radio" name="answers" value="other"> Other
			</form>
			<input type="button" value="back">
			<input type="button" value="save">
			<input type="submit" value="next">
		</div>
		*/

		var that = this;

		this.CONTAINER_ID = "quizz-container";
		this.QUESTION_PARAGRAPH_ID = "quizz-container";
		this.QUIZZ_TIME_ID = "quizz-time";
		this.FORM_ID = "quizz-form";
		this.BACK_BUTTON_ID = "quizz-back-button";
		this.NEXT_BUTTON_ID = "quizz-next-button";
		this.SAVE_BUTTON_ID = "quizz-save-button";

		this.RADIO_GROUP_NAME = "quizz-answers";

		this.quizz = quizzContent;
		this.actualQuestion = 0;
		this.timeCounter = this.quizz.quizzTime;
		this.timer = null;

		this.targetElement = $("#"+targetId);
		this.quizzTitle = $("<h3>"+quizzContent.quizzName+"</h3>");
		this.quizzTime = $("<span id='"+this.QUIZZ_TIME_ID+"'></span>").text(quizzContent.quizzTime);
		this.quizzContainer = $("<div id='"+CONTAINER_ID+"'></div>");
		this.questionParagraph = $("<p id='"+QUESTION_PARAGRAPH_ID+"'></p>");
		this.formParagraph = $("<form id='"+FORM_ID+"'></form>");

		this.quizzContainer.append(this.questionParagraph);
		this.quizzContainer.append(this.formParagraph);
		this.targetElement.append(this.quizzTitle);
		this.targetElement.append(this.quizzTime);
		this.targetElement.append(this.quizzContainer);

		this.startButton = $("<input type='button' value='start quizz'></input>");
		this.startButton.click(function(){
			this.remove();
			createActualQuestion();
			that.timer = setInterval(function(){
				that.timeCounter = that.timeCounter - 1;
				if(that.timeCounter < 0){
					alert("Time is out");
					//Call function to end the quizz;
					clearInterval(that.timer);
					that.quizzContainer.empty();
					that.quizzContainer.append($("<p>Quizz is Over</p>"));
				}else{
					that.quizzTime.text(that.timeCounter);	
				}
			}, 1000)
		});

		this.quizzContainer.append(this.startButton);

		
		console.log("Quizz title: "+JSON.stringify(that.quizzTitle));
		function createActualQuestion(){
			console.log("actual question "+that.actualQuestion);
			var question = that.quizz.questions[that.actualQuestion];
			//Clean the form to fill with the new options
			that.formParagraph.empty();

			//Configure the question enunciate
			that.questionParagraph.text(question.question);
			console.log("question.options.length: "+question.options.length);
			
			for(var index = 0; index < question.options.length; index++){
				var actualAnswer = question.options[index];
				that.formParagraph.append(actualAnswer.key);
				that.formParagraph.append($("<input type='radio' name='"+RADIO_GROUP_NAME+"' value='"+actualAnswer.key+"'>"));
				that.formParagraph.append(actualAnswer.value);
				
			}

			if(that.actualQuestion > 0){
				that.backButton = $("<input type='button' value='back'></input>");
				that.backButton.click(function(){
					that.actualQuestion = that.actualQuestion-1;
					createActualQuestion();
				});

				that.formParagraph.append(that.backButton);
			}
			if(that.actualQuestion < (that.quizz.questions.length-1)){
				that.nextButton = $("<input type='button' value='next'></input>");
				that.nextButton.click(function(){
					that.actualQuestion = that.actualQuestion+1;
					createActualQuestion();
				});
				that.formParagraph.append(that.nextButton);
			}
			that.saveButton = $("<input type='button' value='save'></input>");
			that.saveButton.click(function(){
				console.log("Before save: "+JSON.stringify(that.quizz.questions[that.actualQuestion]));
				var selected = $('input[name='+that.RADIO_GROUP_NAME+']:checked').val();
				that.quizz.questions[that.actualQuestion].studentAnswer = selected;
				console.log("After save: "+JSON.stringify(that.quizz.questions[that.actualQuestion]));
			});
			that.formParagraph.append(that.saveButton);

			if(question.studentAnswer){
				$('input[name='+that.RADIO_GROUP_NAME+'][value='+question.studentAnswer+']').prop('checked', true);
			}
			
		}
	}

	var myquizz = { 
		quizzName: "quizz 1",
		quizzTime: 10,
		questions: [
		{
			question: "How do you write an 'On Ready' statment in Jquery?",
			options: [
			{
				key: "A",
				value: "$('onReady').function(){//your code}"
			},
			{
				key: "B",
				value: "$(document).ready(function(){//your code})"
			},
			],
			studentAnswer: undefined,
			rightQuestionKey: "B"
		},
		{
			question: "What is bootstrap?",
			options: [
			{
				key: "A",
				value: "A css framework"
			},
			{
				key: "B",
				value: "A JScript framework"
			},
			],
			studentAnswer: undefined,
			rightQuestionKey: "A"
		},
		]
	}

	createQuizz("comp-quizz", myquizz);

})