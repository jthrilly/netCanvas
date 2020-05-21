import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import defaultMarkdownRenderers from '../../../utils/markdownRenderers';
import { ALLOWED_MARKDOWN_TAGS } from '../../../config';
import withPrompt from '../../../behaviours/withPrompt';
import { makeNetworkNodesForType as makeGetNodes } from '../../../selectors/interface';
import { getNetworkEdges as getEdges } from '../../../selectors/network';
import { getProtocolCodebook } from '../../../selectors/protocol';
import { actionCreators as sessionsActions } from '../../../ducks/modules/sessions';
import ProgressBar from '../../../components/ProgressBar';
import PromptSwiper from '../../PromptSwiper';
import { getNode, getPairs } from './helpers';
import useSteps from './useSteps';
import useNetworkEdgeState from './useEdgeState';
import useAutoAdvance from './useAutoAdvance';
import Pair, { getPairVariants } from './Pair';
import Button from './Button';

const fadeVariants = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const canSkip = false;

/**
  * Dyad Census Interface
  */
const DyadCensus = ({
  onComplete,
  registerBeforeNext,
  promptId: promptIndex, // TODO: what is going on here?
  prompt,
  promptBackward,
  promptForward,
  stage,
  pairs,
  nodes,
  edges,
  edgeColor,
  dispatch,
}) => {
  const [isIntroduction, setIsIntroduction] = useState(true);
  const [isForwards, setForwards] = useState(true);
  // Number of pairs times number of prompts e.g. `[3, 3, 3]`
  const steps = Array(stage.prompts.length).fill(pairs.length);
  const [state, nextStep, previousStep] = useSteps(steps);

  if (pairs.length === 0) { return null; }

  const pair = get(pairs, state.substep, null);
  const fromNode = getNode(nodes, pair[0]);
  const toNode = getNode(nodes, pair[1]);
  // const isForwards = state.direction !== 'backward'; // .i.e. default to true

  const [hasEdge, setEdge, isTouched, isChanged] = useNetworkEdgeState(
    dispatch,
    edges,
    prompt.createEdge,
    pair,
    state.step,
    state.progress,
  );

  const next = () => {
    setForwards(true);

    if (isIntroduction) {
      setIsIntroduction(false);
      return;
    }

    // check value has been set
    if (!canSkip && hasEdge === null) {
      return;
    }

    // go to next step
    if (state.isEnd) {
      onComplete();
      return;
    }

    if (state.isStageEnd) {
      dispatch(sessionsActions.updatePrompt(promptIndex + 1));
    }

    // TODO: chheck state in here
    nextStep();
  };

  const back = () => {
    setForwards(false);

    // go to next step
    if (state.isStart && !isIntroduction) {
      setIsIntroduction(true);
      return;
    }

    // go to next step
    if (state.isStart) {
      onComplete();
      return;
    }

    if (state.isStageStart) {
      dispatch(sessionsActions.updatePrompt(promptIndex - 1));
    }

    // TODO: check state in here
    previousStep();
  };

  // TODO: Should this also receive an onComplete method?
  const beforeNext = useCallback((direction) => {
    if (direction < 0) {
      back();
      return;
    }

    next();
  }, [back, next]);

  useEffect(() => {
    registerBeforeNext(beforeNext);
  }, [beforeNext]);

  useAutoAdvance(next, isTouched, isChanged);

  const handleChange = nextValue =>
    () => {
      // 'debounce' clicks, one click (isTouched) should start auto-advance
      // so ignore further clicks
      if (isTouched) { return; }
      setEdge(nextValue);
    };

          // <ReactMarkdown
            // source={stage.introductionPanel.text}
            // allowedTypes={ALLOWED_MARKDOWN_TAGS}
            // renderers={defaultMarkdownRenderers}
          // />

  return (
    <div className="interface dyad-interface">
      <motion.div
        className="interface__prompt"
        variants={fadeVariants}
        initial="hide"
        animate={!isIntroduction ? 'show' : 'hide'}
      >
        <PromptSwiper
          forward={promptForward}
          backward={promptBackward}
          prompt={prompt}
          prompts={stage.prompts}
        />
      </motion.div>
      <div className="interface__main">
        <div className="dyad-interface__layout">
          <div className="dyad-interface__pairs">
            <AnimatePresence
              custom={[isForwards]}
              initial={false}
            >
              { isIntroduction &&
                <motion.div
                  className="dyad-interface__introduction"
                  custom={[isForwards]}
                  variants={getPairVariants()}
                  initial="initial"
                  animate="show"
                  exit="hide"
                >
                  <h1>{stage.introductionPanel.title}</h1>
                  <ReactMarkdown
                    source={stage.introductionPanel.text}
                    allowedTypes={ALLOWED_MARKDOWN_TAGS}
                    renderers={defaultMarkdownRenderers}
                  />
                </motion.div>
              }
              { !isIntroduction &&
                <Pair
                  key={`${promptIndex}_${state.step}`}
                  edgeColor={edgeColor}
                  hasEdge={hasEdge}
                  animateForwards={isForwards}
                  fromNode={fromNode}
                  toNode={toNode}
                />
              }
            </AnimatePresence>
          </div>
          <motion.div
            className="dyad-interface__choice"
            variants={fadeVariants}
            initial="hide"
            animate={!isIntroduction ? 'show' : 'hide'}
          >
            <div className="dyad-interface__options">
              <div className="dyad-interface__yes">
                <Button
                  onClick={handleChange(true)}
                  selected={hasEdge}
                >Yes</Button>
              </div>
              <div className="dyad-interface__no">
                <Button
                  onClick={handleChange(false)}
                  selected={!hasEdge && hasEdge !== null}
                  className="no"
                >No</Button>
              </div>
            </div>
            <div className="dyad-interface__progress">
              <h6 className="progress-container__status-text">
                <strong>{state.substep + 1}</strong> of <strong>{pairs.length}</strong>
              </h6>
              <ProgressBar orientation="horizontal" percentProgress={((state.step + 1) / pairs.length) * 100} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

DyadCensus.defaultProps = {
  form: null,
};

DyadCensus.propTypes = {
  prompt: PropTypes.object.isRequired,
  promptBackward: PropTypes.func.isRequired,
  promptForward: PropTypes.func.isRequired,
  stage: PropTypes.object.isRequired,
};

const makeMapStateToProps = () => {
  const getNodes = makeGetNodes();

  const mapStateToProps = (state, props) => {
    const nodes = getNodes(state, props);
    const edges = getEdges(state, props);
    const codebook = getProtocolCodebook(state, props);
    const edgeColor = get(codebook, ['edge', props.prompt.createEdge, 'color']);
    const pairs = getPairs(nodes);

    return {
      pairs,
      nodes,
      edges,
      edgeColor,
    };
  };

  return mapStateToProps;
};

export default compose(
  withPrompt,
  connect(makeMapStateToProps),
)(DyadCensus);

export {
  DyadCensus as UnconnectedDyadCensus,
};