export class CreateVocabularyDto {
  lessonId: number;
  hanzi: string;
  pinyin: string;
  meaningVn: string;
  audioUrl?: string;
  strokeOrderSvg?: string;
  exampleHanzi?: string;
  exampleMeaning?: string;
}
