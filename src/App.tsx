import "./styles.css";
import { Tree } from "./Tree/Tree";

export default function App() {
  return (
    <div className="App">
      <div style={{ width: 400 }}>
        <Tree
          data={[
            {
              id: 1,
              content: "Hello world"
            },
            {
              id: 2,
              parent: 1,
              content: "Child 1"
            },
            {
              id: 3,
              parent: 1,
              content: "Child 2"
            },
            {
              id: 4,
              parent: 3,
              content: "Child 3"
            },
            {
              id: 5,
              parent: 3,
              content: "Child 4"
            },
            {
              id: 6,
              parent: 2,
              content: "123"
            },
            {
              id: 7,
              parent: 4,
              content: "hello world"
            }
          ]}
        />
      </div>
    </div>
  );
}
