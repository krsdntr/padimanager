export type Variety = {
  id: string;
  name: string;
  category: 'Inpari' | 'Inpago' | 'Hipa' | 'Lokal';
  description: string;
  harvest_age: number; // in days
  yield_potential: string;
  elevation_suitability: string;
  resistance: string[];
};

export type PestDisease = {
  id: string;
  name: string;
  scientific_name?: string;
  symptoms: string;
  solution: string;
  type: 'pest' | 'disease';
  trigger?: string;
};

export type Fertilizer = {
  id: string;
  name: string;
  type: 'Makro' | 'Mikro';
  description: string;
  deficiency_symptoms: string;
  toxicity_symptoms?: string;
  dosage_per_ha: string;
  application_time: string;
};

export type PlantingCycle = {
  id: string;
  variety_id: string;
  start_date: string; // ISO date
  field_area: number; // in Ha
  status: 'active' | 'harvested' | 'aborted';
};

export type TaskType = 'fertilizer' | 'water' | 'pest_control' | 'weeding' | 'harvest';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'benih' 
  | 'pupuk' 
  | 'pestisida' 
  | 'tenaga_kerja' 
  | 'sewa_lahan' 
  | 'panen' 
  | 'operasional' 
  | 'lainnya';

export type Transaction = {
  id: string;
  cycle_id?: string;
  date: string; // ISO date
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
};

export type Task = {
  id: string;
  cycle_id: string;
  day_offset: number; // HST (Hari Setelah Tanam)
  scheduled_date: string; // ISO date
  type: TaskType;
  title: string;
  description: string;
  is_completed: boolean;
  completed_at?: string;
};
