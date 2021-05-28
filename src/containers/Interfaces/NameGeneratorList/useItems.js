import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { get, differenceBy } from 'lodash';
import { makeGetNodeLabel, makeGetNodeTypeDefinition } from '../../../selectors/network';
import {
  makeNetworkNodesForPrompt,
  makeNetworkNodesForOtherPrompts,
} from '../../../selectors/interface';
import { getCardAdditionalProperties } from '../../../selectors/name-generator';
import { entityPrimaryKeyProperty } from '../../../ducks/modules/network';
import usePropSelector from './usePropSelector';
import { detailsWithVariableUUIDs } from './helpers';

const makeGetNodesForList = () => {
  const getNodesForPrompt = makeNetworkNodesForPrompt(); // TODO: Do this filter after search
  const networkNodesForOtherPrompts = makeNetworkNodesForOtherPrompts();

  return (state, props) => {
    const externalNodes = get(props, 'externalData.nodes', []);

    // Remove nodes nominated elsewhere (previously a prop called 'showExistingNodes')
    return differenceBy(
      externalNodes,
      [...networkNodesForOtherPrompts(state, props), ...getNodesForPrompt(state, props)],
      entityPrimaryKeyProperty,
    );
  };
};

const useItems = (props) => {
  const labelGetter = usePropSelector(makeGetNodeLabel, props, true);
  const nodeTypeDefinition = usePropSelector(makeGetNodeTypeDefinition, props, true);
  const visibleSupplementaryFields = usePropSelector(getCardAdditionalProperties, props);
  const nodes = usePropSelector(makeGetNodesForList, props, true, shallowEqual);

  const items = useMemo(() => nodes
    .map(
      (item) => ({
        id: item[entityPrimaryKeyProperty],
        data: { ...item.attributes },
        props: {
          label: labelGetter(item),
          details: detailsWithVariableUUIDs({
            ...props,
            nodeTypeDefinition,
            visibleSupplementaryFields,
          })(item),
        },
      }),
    ), [nodes, labelGetter, nodeTypeDefinition, visibleSupplementaryFields]);

  return items;
};

export default useItems;
