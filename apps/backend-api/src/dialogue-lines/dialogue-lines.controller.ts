import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DialogueLinesService } from './dialogue-lines.service';
import { CreateDialogueLineDto } from './dto/create-dialogue-line.dto';
import { UpdateDialogueLineDto } from './dto/update-dialogue-line.dto';

@Controller('dialogue-lines')
export class DialogueLinesController {
  constructor(private readonly dialogueLinesService: DialogueLinesService) {}

  @Post()
  create(@Body() createDialogueLineDto: CreateDialogueLineDto) {
    return this.dialogueLinesService.create(createDialogueLineDto);
  }

  @Get()
  findAll() {
    return this.dialogueLinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dialogueLinesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDialogueLineDto: UpdateDialogueLineDto,
  ) {
    return this.dialogueLinesService.update(+id, updateDialogueLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dialogueLinesService.remove(+id);
  }
}
