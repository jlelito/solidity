import React from 'react';
import drizzleOptions from './drizzleOptions';
import{ LoadingContainer } from 'drizzle-react-components';
import { DrizzleProvider } from 'drizzle-react';
import MyComponent from './MyComponent';

function App() {
  return (
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <MyComponent />
      </LoadingContainer>
    </DrizzleProvider>


  );
}

export default App;
