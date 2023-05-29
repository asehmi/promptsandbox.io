import { Node } from "reactflow";

import { Inputs } from "./Input";

import { DocumentDbSchema } from "./dbTypes";

export type DefaultNodeDataType = {
  name: string;
  text: string;
  inputs: Inputs;
  children: string[];
  response: string;
  isLoading: boolean;
  isBreakpoint: boolean;
  loopId?: string;
  isDetailMode: boolean;
};

export type AllDataTypes =
  | LLMPromptNodeDataType
  | TextNodeDataType
  | ChatPromptNodeDataType
  | ClassifyNodeDataType
  | ClassifyNodeCategoriesDataType
  | ChatMessageNodeDataType
  | SearchDataType
  | OutputTextDataType
  | InputTextDataType
  | CombineDataType
  | ConditionalDataType
  | CounterDataType
  | LoopDataType
  | SingleChatPromptDataType
  | FileTextDataType;

export type CustomNode = Node<AllDataTypes>;
export type InputNode = Node<AllDataTypes>;

export type OpenAIAPIRequest = {
  model: string;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  response: string;
  stop: string[];
};

export type LLMPromptNodeDataType = {
  best_of: number;
} & OpenAIAPIRequest &
  DefaultNodeDataType;
export type ChatPromptNodeDataType = LLMPromptNodeDataType;

export type SingleChatPromptDataType = LLMPromptNodeDataType;

export type ChatMessageNodeDataType = {
  role: "user" | "assistant" | "system";
} & DefaultNodeDataType;

export type TextNodeDataType = DefaultNodeDataType;

export type PlaceholderDataType = {
  typeToCreate: NodeTypesEnum | null;
} & DefaultNodeDataType;

export type ClassifyNodeDataType = {
  textType: string;
} & OpenAIAPIRequest &
  DefaultNodeDataType;

export type ClassifyNodeCategoriesDataType = {
  classifications: {
    id: string;
    value: string;
  }[];
} & DefaultNodeDataType;

type DocumentDataType = {
  document?: DocumentDbSchema;
};

export type FileTextDataType = DocumentDataType & DefaultNodeDataType;
export type SearchDataType = {
  askUser: boolean;
  returnSource: boolean;
  docs: string;
} & OpenAIAPIRequest &
  DefaultNodeDataType;

export type CombineDataType = DefaultNodeDataType;
export type InputTextDataType = DefaultNodeDataType;
export type OutputTextDataType = DefaultNodeDataType;

export enum ConditionalBooleanOperation {
  EqualTo = "Equal To",
  NotEqualTo = "Not Equal To",
  LessThan = "Less Than",
  GreaterThan = "Greater Than",
  LessThanOrEqualTo = "Less Than Or Equal To",
  GreaterThanOrEqualTo = "Greater Than Or Equal To",
}

export type ConditionalDataType = {
  booleanOperation: ConditionalBooleanOperation;
  value: string;
  valueToCompare: string;
} & DefaultNodeDataType;

export type CounterDataType = DefaultNodeDataType;

export type LoopDataType = {
  loopCount: number;
  loopMax: number;
} & DefaultNodeDataType;

export type listOperation =
  | "+ Add to end"
  | "+ Add to start"
  | "- Remove last"
  | "- Remove first";

  export enum DocSource {
  websiteUrl = "Website URL",
  pdfUrl = "PDF URL",
  pdf = "PDF File",
}

export enum NodeTypesEnum {
  llmPrompt = "llmPrompt",
  text = "text",
  singleChatPrompt = "singleChatPrompt",
  chatPrompt = "chatPrompt",
  chatMessage = "chatMessage",
  classify = "classify",
  classifyCategories = "classifyCategories",
  placeholder = "placeholder",
  loop = "loop",
  conditional = "conditional",
  counter = "counter",
  inputText = "inputText",
  outputText = "outputText",
  fileText = "fileText",
  search = "search",
  combine = "combine",
}
