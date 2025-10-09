import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import { Tramite } from './tramites.entity';
import { TramiteGroup } from './dto/tramite-group.dto';

@Injectable()
export class TramitesService {
  constructor(private readonly supabase: SupabaseService) {}

  async getAll(): Promise<Tramite[]> {
    const { data, error } = await this.supabase.client
      .from('tramites')
      .select('*');
    if (error) throw new Error(error.message);
    return data as Tramite[];
  }

  async findAllGrouped(): Promise<TramiteGroup[]> {
    const { data, error } = await this.supabase.client
      .from('tramites')
      .select('*');

    if (error) throw new Error(error.message);

    const tramites = (data || []) as Tramite[];
    const groupedMap = tramites.reduce(
      (acc: Record<string, Tramite[]>, t: Tramite) => {
        if (!acc[t.category]) acc[t.category] = [];
        acc[t.category].push(t);
        return acc;
      },
      {} as Record<string, Tramite[]>,
    );

    return Object.entries(groupedMap).map(
      ([category, tramitesList]): TramiteGroup => ({
        category,
        tramites: tramitesList,
      }),
    );
  }
}
