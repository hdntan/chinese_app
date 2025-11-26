import { PartialType } from '@nestjs/mapped-types';
import { CreateDialogueLineDto } from './create-dialogue-line.dto';

export class UpdateDialogueLineDto extends PartialType(CreateDialogueLineDto) {}
