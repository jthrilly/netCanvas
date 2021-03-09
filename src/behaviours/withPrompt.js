import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { actionCreators as sessionsActions } from '../ducks/modules/sessions';
import { getPromptIndexForCurrentSession } from '../selectors/session';
import { getProtocolStages } from '../selectors/protocol';

export default function withPrompt(WrappedComponent) {
  class WithPrompt extends Component {
    isFirstPrompt = () => {
      const { promptIndex } = this.props;
      return promptIndex === 0;
    }

    isLastPrompt = () => {
      const { promptIndex } = this.props;
      const lastPromptIndex = this.promptsCount() - 1;
      return promptIndex === lastPromptIndex;
    }

    promptForward = () => {
      const { updatePrompt, promptIndex } = this.props;

      updatePrompt(
        (this.promptsCount() + promptIndex + 1) % this.promptsCount(),
      );
    }

    promptBackward = () => {
      const { updatePrompt, promptIndex } = this.props;

      updatePrompt(
        (this.promptsCount() + promptIndex - 1) % this.promptsCount(),
      );
    }

    prompt() {
      const { promptIndex } = this.prompts;

      return get(this.prompts(), promptIndex);
    }

    promptsCount() {
      return this.prompts().length;
    }

    prompts() {
      return get(this.props, ['stage', 'prompts']);
    }

    render() {
      const { promptIndex, ...rest } = this.props;
      return (
        <WrappedComponent
          prompt={this.prompt()}
          promptForward={this.promptForward}
          promptBackward={this.promptBackward}
          isLastPrompt={this.isLastPrompt}
          isFirstPrompt={this.isFirstPrompt}
          {...rest}
        />
      );
    }
  }
  WithPrompt.propTypes = {
    stage: PropTypes.object.isRequired,
    promptIndex: PropTypes.number,
    updatePrompt: PropTypes.func.isRequired,
  };

  WithPrompt.defaultProps = {
    promptIndex: 0,
  };

  function mapStateToProps(state, ownProps) {
    let promptIndex = ownProps.promptId;
    if (promptIndex === undefined) {
      promptIndex = getPromptIndexForCurrentSession(state);
    }
    return {
      promptIndex,
      stage: ownProps.stage || getProtocolStages(state)[ownProps.stageIndex],
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      updatePrompt: bindActionCreators(sessionsActions.updatePrompt, dispatch),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithPrompt);
}
