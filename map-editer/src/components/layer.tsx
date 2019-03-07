/**
 * 图层组件，类似ps中的图层
 */
import * as React from 'react';
import { Box, Text } from 'react-desktop/macOs';

class Layer extends React.Component {
  public constructor(props:{c:2}) {
    super(props)
  }
  public render() {
    return (
      <Box label="Box" padding="10px 30px">
        <Text>Some text...</Text>
        <p>Hello</p>
      </Box>
    );
  }
}

export default Layer;
