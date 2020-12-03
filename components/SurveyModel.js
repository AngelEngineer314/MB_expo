import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, ViewPropTypes } from 'react-native';
import SelectionGroup, { SelectionHandler } from 'react-native-selection-group';


export class SurveyModel extends Component {
    static propTypes = {
        survey: PropTypes.arrayOf(
            PropTypes.shape({
                question_type: PropTypes.string.isRequired,
                question: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
                id: PropTypes.any.isRequired,
                answers: PropTypes.arrayOf(PropTypes.shape({
                    id: PropTypes.any.isRequired,
                    answer: PropTypes.string.isRequired,
                }))
            }).isRequired
        ).isRequired,
        onAnswerSubmitted: PropTypes.func,
        onSurveyFinished: PropTypes.func,
        renderSelector: PropTypes.func,
        renderTextInput: PropTypes.func,
        selectionGroupContainerStyle: ViewPropTypes.style,
        containerStyle: ViewPropTypes.style,
        renderPrev: PropTypes.func,
        renderNext: PropTypes.func,
        renderFinished: PropTypes.func,
        renderInfo: PropTypes.func,
        autoAdvance: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = { currentQuestionIndex: 0, answers: [] };
        this.updateAnswer.bind(this);
        this.selectionHandlers = [];
    }

    getAnswers() {
        const filteredAnswers = this.state.answers.filter(n => n);
        return filteredAnswers;
    }

    updateAnswer(answerForCurrentQuestion) {
        const { answers } = this.state;
        answers[this.state.currentQuestionIndex] = answerForCurrentQuestion;
        this.setState({ answers });
    }

    // Do what the next or finished button normally do.
    autoAdvance() {
        const { answers } = this.state;
        const { survey } = this.props;
        let { currentQuestionIndex } = this.state;
        if (survey[currentQuestionIndex].question_type === 'multiple') {
          return;
        }

        if (currentQuestionIndex === this.props.survey.length - 1) {
            if (this.props.onAnswerSubmitted && answers[currentQuestionIndex]) {
                this.props.onAnswerSubmitted(answers[currentQuestionIndex]);
            }
            if (this.props.onSurveyFinished) {
                // Remove empty answers, coming from info screens.
                const filteredAnswers = answers.filter(n => n);
                this.props.onSurveyFinished(filteredAnswers);
            }
        } else {
            if (this.props.onAnswerSubmitted && answers[currentQuestionIndex]) {
                this.props.onAnswerSubmitted(answers[currentQuestionIndex]);
            }
            currentQuestionIndex++;
            this.setState({ currentQuestionIndex });
        }
    }

    renderPreviousButton() {
        if (!this.props.renderPrevious) return;
        let { currentQuestionIndex } = this.state;
        return (
            this.props.renderPrevious(() => {
                currentQuestionIndex--;
                this.setState({ currentQuestionIndex });
            }, (currentQuestionIndex !== 0)
            ));
    }

    renderFinishOrNextButton() {
        const { answers } = this.state;
        const { survey } = this.props;
        let { currentQuestionIndex } = this.state;

        let enabled = enabled = Boolean(answers[currentQuestionIndex]) && (answers[currentQuestionIndex].value || answers[currentQuestionIndex].value === 0);

        if (currentQuestionIndex === this.props.survey.length - 1) {
            if (!this.props.renderFinished) return;
            return (
                this.props.renderFinished(() => {
                    if (this.props.onAnswerSubmitted && answers[currentQuestionIndex]) {
                        this.props.onAnswerSubmitted(answers[currentQuestionIndex]);
                    }
                    if (this.props.onSurveyFinished) {
                        // Remove empty answers, coming from info screens.
                        const filteredAnswers = answers.filter(n => n);
                        this.props.onSurveyFinished(filteredAnswers);
                    }
                }, enabled));
        }
        if (!this.props.renderNext) return;
        return (
            this.props.renderNext(() => {
                if (this.props.onAnswerSubmitted && answers[currentQuestionIndex]) {
                    this.props.onAnswerSubmitted(answers[currentQuestionIndex]);
                }
                currentQuestionIndex++;
                this.setState({ currentQuestionIndex });
            }, enabled)
        );
    }

    renderNavButtons() {
        const { navButtonContainerStyle } = this.props;
        if (this.props.renderPrevious || this.props.renderNext || this.props.renderFinished) {
            return (
                <View style={navButtonContainerStyle}>
                    {this.renderPreviousButton && this.renderPreviousButton()}
                    {this.renderFinishOrNextButton && this.renderFinishOrNextButton()}
                </View>
            );
        }
        return;
    }

    renderSelectionGroup() {
        const { survey, renderSelector, selectionGroupContainerStyle, containerStyle } = this.props;
        const { currentQuestionIndex } = this.state;

        this.selectionHandlers[currentQuestionIndex] = new SelectionHandler({ maxMultiSelect: 1, allowDeselect: true });

        return (
            <View style={containerStyle}>
                {this.props.renderQuestionText ?
                    this.props.renderQuestionText(this.props.survey[currentQuestionIndex].question) : null}
                <SelectionGroup
                    onPress={this.selectionHandlers[currentQuestionIndex].selectionHandler}
                    items={survey[currentQuestionIndex].answers}
                    isSelected={this.selectionHandlers[currentQuestionIndex].isSelected}
                    renderContent={renderSelector}
                    containerStyle={selectionGroupContainerStyle}
                    onItemSelected={(item) => {
                        this.updateAnswer({
                            id: survey[currentQuestionIndex].id,
                            value: item
                            });
                        //(this.props.autoAdvance || autoAdvanceThisQuestion) && this.autoAdvance();
                    }}
                    onItemDeselected={() => {
                        this.updateAnswer({
                            id: survey[currentQuestionIndex].id,
                            value: null
                        });
                    }}
                />
                {this.renderNavButtons()}
            </View>
        );
    }

    renderMultipleSelectionGroup() {
        const { survey, renderSelector, selectionGroupContainerStyle, containerStyle } = this.props;
        const { currentQuestionIndex } = this.state;
        const maxMultiSelect = survey[currentQuestionIndex].answers.length;
        this.selectionHandlers[currentQuestionIndex] = new SelectionHandler({ maxMultiSelect:maxMultiSelect, allowDeselect: true });

        return (
            <View style={containerStyle}>
                {this.props.renderQuestionText ?
                    this.props.renderQuestionText(this.props.survey[currentQuestionIndex].question) : null}
                <SelectionGroup
                    onPress={this.selectionHandlers[currentQuestionIndex].selectionHandler}
                    items={survey[currentQuestionIndex].answers}
                    isSelected={this.selectionHandlers[currentQuestionIndex].isSelected}
                    getAllSelectedItemIndexes={this.selectionHandlers[currentQuestionIndex].getAllSelectedItemIndexes}
                    renderContent={renderSelector}
                    containerStyle={selectionGroupContainerStyle}
                    onItemSelected={(item, allSelectedItems) => {
                        this.updateAnswer({
                            id: survey[currentQuestionIndex].id,
                            value: allSelectedItems
                        });
                        //(autoAdvanceThisQuestion || this.props.autoAdvance) && this.autoAdvance();
                    }}
                    onItemDeselected={(item, allSelectedItems) => {
                        this.updateAnswer({
                            id: survey[currentQuestionIndex].id,
                            value: allSelectedItems
                        });
                    }}
                />
                {this.renderNavButtons()}
            </View>
        );
    }

    renderTextInputElement() {
        const { survey, renderTextInput, containerStyle } = this.props;
        const currentQuestionIndex = this.state.currentQuestionIndex;
        const answers = this.state.answers;
        const { question, id } = survey[currentQuestionIndex];

        return (<View style={containerStyle}>
            {this.props.renderQuestionText ?
                this.props.renderQuestionText(question) : null}
            {renderTextInput((value) =>
                this.updateAnswer({
                    id,
                    value
                }),
                answers[currentQuestionIndex] === undefined ? undefined : answers[currentQuestionIndex].value,
                //this.props.autoAdvance ? this.autoAdvance.bind(this) : null
            )}
            {this.renderNavButtons()}
        </View>
        );
    }

    render() {
        const { survey } = this.props;
        const currentQuestion = this.state.currentQuestionIndex;
        switch (survey[currentQuestion].question_type) {
            case 'single': return this.renderSelectionGroup();
            case 'multiple': return this.renderMultipleSelectionGroup();
            case 'text': return this.renderTextInputElement();
            default: return <View />;
        }
    }
}