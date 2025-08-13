import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('elasticsearch.url'),
    });
  }

  async onModuleInit() {
    await this.createIndices();
  }

  async search(params: any) {
    return this.client.search(params);
  }

  async index(params: any) {
    return this.client.index(params);
  }

  async delete(params: any) {
    return this.client.delete(params);
  }

  async bulk(params: any) {
    return this.client.bulk(params);
  }

  private async createIndices() {
    try {
      // Create courses index
      const coursesIndexExists = await this.client.indices.exists({
        index: 'courses',
      });

      if (!coursesIndexExists.body) {
        await this.client.indices.create({
          index: 'courses',
          body: {
            mappings: {
              properties: {
                title: {
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                description: {
                  type: 'text',
                  analyzer: 'standard',
                },
                category: {
                  type: 'text',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                level: {
                  type: 'keyword',
                },
                status: {
                  type: 'keyword',
                },
                tags: {
                  type: 'text',
                  analyzer: 'standard',
                },
                price: {
                  type: 'float',
                },
                rating: {
                  type: 'float',
                },
                totalStudents: {
                  type: 'integer',
                },
                instructorId: {
                  type: 'keyword',
                },
                createdAt: {
                  type: 'date',
                },
                publishedAt: {
                  type: 'date',
                },
                suggest: {
                  type: 'completion',
                  analyzer: 'simple',
                  preserve_separators: true,
                  preserve_position_increments: true,
                  max_input_length: 50,
                },
              },
            },
            settings: {
              analysis: {
                analyzer: {
                  autocomplete: {
                    tokenizer: 'autocomplete',
                    filter: ['lowercase'],
                  },
                },
                tokenizer: {
                  autocomplete: {
                    type: 'edge_ngram',
                    min_gram: 2,
                    max_gram: 10,
                    token_chars: ['letter'],
                  },
                },
              },
            },
          },
        });

        console.log('Created courses index');
      }
    } catch (error) {
      console.error('Error creating indices:', error);
    }
  }
}