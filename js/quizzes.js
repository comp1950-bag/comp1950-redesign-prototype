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

		this.QUIZZ_CONTAINER_CLASS = "quizz-container";
		this.QUIZZ_TITLE_CLASS = "quizz-title";
		this.QUIZZ_TIMER_CLASS = "quizz-timer";
		this.QUIZZ_QUESTION_CONTAINER_CLASS = "quizz-question-container";
		this.QUIZZ_FORM_CLASS = "quizz-form";
		this.QUIZZ_QUESTION_CLASS = "quizz-question";
		this.QUIZZ_ANSWER_OPTION = "answer-option";
		this.QUIZZ_BUTTON_START_CLASS = "quizz-button-start";
		this.QUIZZ_BUTTON_BACK_CLASS = "quizz-button-back";
		this.QUIZZ_BUTTON_NEXT_CLASS = "quizz-button-next";
		this.QUIZZ_BUTTON_SAVE_CLASS = "quizz-button-save";
		this.QUIZZ_BUTTON_SUBMIT_CLASS = "quizz-button-submit";

		this.CONTAINER_ID = "quizz-container";
		this.QUESTION_PARAGRAPH_ID = "quizz-container";
		this.QUIZZ_TIME_ID = "quizz-time";
		this.FORM_ID = "quizz-form";
		this.ANSWER_TEXTAREA_ID = "quizz-answer-textarea";
		this.BACK_BUTTON_ID = "quizz-back-button";
		this.NEXT_BUTTON_ID = "quizz-next-button";
		this.SAVE_BUTTON_ID = "quizz-save-button";

		this.RADIO_GROUP_NAME = "quizz-answers";

		this.quizz = quizzContent;
		this.actualQuestion = 0;
		this.timeCounter = this.quizz.quizzTime;
		this.timer = null;

		this.targetElement = $("#"+targetId);
		this.targetElement.addClass(this.QUIZZ_CONTAINER_CLASS);
		this.targetElement.addClass("card");
		this.quizzTitle = $("<h3>"+quizzContent.quizzName+"</h3>");
		this.quizzTitle.addClass(this.QUIZZ_TITLE_CLASS);
		this.quizzTime = $("<span id='"+this.QUIZZ_TIME_ID+"'></span>").text(getFormattedTime(quizzContent.quizzTime));
		this.quizzQuestionContainer = $("<div id='"+CONTAINER_ID+"'></div>");
		this.quizzQuestionContainer.addClass(this.QUIZZ_QUESTION_CONTAINER_CLASS);
		this.questionParagraph = $("<p id='"+QUESTION_PARAGRAPH_ID+"'></p>");
		this.questionParagraph.addClass(this.QUIZZ_QUESTION_CLASS);
		this.answerForm = $("<form id='"+FORM_ID+"'></form>");
		this.answerForm.addClass(this.QUIZZ_FORM_CLASS);

		this.quizzQuestionContainer.append(this.questionParagraph);
		this.quizzQuestionContainer.append(this.answerForm);
		
		this.quizzTimeContainer = $("<div></div>");
		this.quizzTimeContainer.addClass(this.QUIZZ_TIMER_CLASS);
		this.quizzTimeContainer.append($("<i class='fa fa-clock-o'>"));
		this.quizzTimeContainer.append(this.quizzTime);

		this.targetElement.append(this.quizzTitle);
		this.targetElement.append(this.quizzTimeContainer);
		this.targetElement.append(this.quizzQuestionContainer);

		this.startButton = $("<input type='button' value='start quizz'></input>");
		this.startButton.addClass(this.QUIZZ_BUTTON_START_CLASS);
		this.startButton.click(function(){
			this.remove();
			createActualQuestion();
			that.timer = setInterval(function(){
				that.timeCounter = that.timeCounter - 1;
				if(that.timeCounter < 0){
					alert("Time is out");
					//Call function to end the quizz;
					clearInterval(that.timer);
					that.quizzQuestionContainer.empty();
					that.quizzQuestionContainer.append($("<p>Quizz is Over</p>"));
				}else{
					that.quizzTime.text(getFormattedTime(that.timeCounter));	
				}
			}, 1000)
		});

		this.quizzQuestionContainer.append(this.startButton);

		function pad (str, max) {
			str = str.toString();
			return str.length < max ? pad("0" + str, max) : str;
		}

		function getFormattedTime(timeSeconds){
			var minutes = Math.floor(timeSeconds / 60);
			var seconds = timeSeconds % 60;
			return pad(minutes,2)+":"+pad(seconds,2);
		}
		
		function submitQuizz(){
			clearInterval(that.timer);
			that.quizzQuestionContainer.empty();
			that.quizzQuestionContainer.append($("<p>Quizz successfully submitted</p>"));
		}

		console.log("Quizz title: "+JSON.stringify(that.quizzTitle));
		function createActualQuestion(){
			
			var question = that.quizz.questions[that.actualQuestion];
			//Clean the form to fill with the new options
			that.answerForm.empty();

			//Configure the question enunciate
			that.questionParagraph.text((that.actualQuestion+1)+". "+question.question);
			if(question.type.toUpperCase() == 'M'){

				for(var index = 0; index < question.options.length; index++){
					var actualAnswer = question.options[index];

					var answerOption = $("<div></div>");
					answerOption.addClass(that.QUIZZ_ANSWER_OPTION);

					answerOption.append($("<label for='r"+actualAnswer.key+"'>"+actualAnswer.key+") </label>"));
					answerOption.append($("<input type='radio' name='"+that.RADIO_GROUP_NAME+"' id='r"+actualAnswer.key
						+"' value='"+actualAnswer.key+"'>"));
					answerOption.append($("<span></span>").text(actualAnswer.value));

					that.answerForm.append(answerOption)

				}
			}else{
				
				that.answerForm.append($("<textarea rows='10' cols='60' id='"+that.ANSWER_TEXTAREA_ID+"'></textarea>"));
			}
			if(that.actualQuestion > 0){
				that.backButton = $("<input type='button' value='back'></input>");
				that.backButton.addClass(that.QUIZZ_BUTTON_BACK_CLASS);
				that.backButton.click(function(){
					that.actualQuestion = that.actualQuestion-1;
					createActualQuestion();
				});

				that.answerForm.append(that.backButton);
			}
			if(that.actualQuestion < (that.quizz.questions.length-1)){
				that.nextButton = $("<input type='button' value='next'></input>");
				that.nextButton.addClass(that.QUIZZ_BUTTON_NEXT_CLASS);
				that.nextButton.click(function(){
					that.actualQuestion = that.actualQuestion+1;
					createActualQuestion();
				});
				that.answerForm.append(that.nextButton);
			}
			that.saveButton = $("<input type='button' value='save'></input>");
			that.saveButton.addClass(that.QUIZZ_BUTTON_SAVE_CLASS);
			that.saveButton.click(function(){
				console.log("Before save: "+JSON.stringify(that.quizz.questions[that.actualQuestion]));
				var answer = undefined;
				if(question.type.toUpperCase() == 'M'){
					answer = $('input[name='+that.RADIO_GROUP_NAME+']:checked').val();
				}else{
					answer = $("#"+that.ANSWER_TEXTAREA_ID).val();
				}
				
				that.quizz.questions[that.actualQuestion].studentAnswer = answer;
				console.log("After save: "+JSON.stringify(that.quizz.questions[that.actualQuestion]));
			});
			that.answerForm.append(that.saveButton);

			that.submitButton = $("<input type='button' value='submit'></input>");
			that.submitButton.addClass(that.QUIZZ_BUTTON_SUBMIT_CLASS);
			that.submitButton.click(function(){
				var countNoAnswers = 0;
				for(var index = 0; index < that.quizz.questions.length; index++){
					if(that.quizz.questions[index].studentAnswer == undefined){
						countNoAnswers++;
					}
				}
				if(countNoAnswers > 0){
					if (confirm('You have '+countNoAnswers+' unsubmitted answer(a). Are you sure you want to procced?')) {
						//Continue to submit
					} else {
						return false;
					}
				}
				submitQuizz();
				
			});
			that.answerForm.append(that.submitButton);

			if(question.studentAnswer){
				if(question.type.toUpperCase() == 'M'){
					$('input[name='+that.RADIO_GROUP_NAME+'][value='+question.studentAnswer+']').prop('checked', true);	
				}else{
					$("#"+that.ANSWER_TEXTAREA_ID).text(question.studentAnswer);
				}
			}
			
		}
	}

	var myquizz = { 
		quizzName: "quizz 1",
		quizzTime: 300,
		questions: [
		{
			question: "How do you write an 'On Ready' statment in Jquery?",
			type:"m",
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
			type:"m",
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
		{
			question: "Describe the web development process",
			type:"o"
		},
		]
	}

	createQuizz("comp-quizz", myquizz);

})