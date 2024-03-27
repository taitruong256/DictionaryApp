import json
from django.core.management.base import BaseCommand
from ...models import Word  

class Command(BaseCommand):
    help = 'Load a words list from JSON file into the database'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str)

    def handle(self, *args, **kwargs):
        json_file_path = kwargs['json_file']
        with open(json_file_path, 'r') as json_file:
            words = json.load(json_file)

            for WORD in words:
                # print(WORD)
                Word.objects.create(
                    # print('helo')
                    word=WORD['Từ vựng'],
                    type=WORD.get('Loại từ') or 'unknown',
                    definition=WORD['Nghĩa'],
                    topic=WORD['Chủ đề'],
                )
                # print(word, type, definition, topic)
                
                
        self.stdout.write(self.style.SUCCESS('Successfully loaded words into database'))
