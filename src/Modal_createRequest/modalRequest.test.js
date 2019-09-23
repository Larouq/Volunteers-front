import React from "react";
import ModalCreateRequest from "./modalRequest";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<ModalCreateRequest />).toJSON();
  expect(tree).toMatchSnapshot();
});
