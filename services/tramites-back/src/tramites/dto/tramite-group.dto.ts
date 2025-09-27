import { ObjectType, Field } from '@nestjs/graphql';
import { Tramite } from '../tramites.entity';

@ObjectType()
export class TramiteGroup {
  @Field()
  category: string;

  @Field(() => [Tramite])
  tramites: Tramite[];
}
