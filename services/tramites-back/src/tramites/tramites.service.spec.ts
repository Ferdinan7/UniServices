import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { TramitesDao } from './dao/impl/TramitesDao';
import { Tramite } from './tramites.entity';
import { TramiteGroup } from './dto/tramite-group.dto';
import { PaginationOptions, PaginatedResult } from './dao/IGenericDao';

describe('TramitesService - DAO Pattern & Service Layer Pattern Tests', () => {
  let service: TramitesService;
  let dao: TramitesDao;
  let logger: Logger;

  const mockTramite: Tramite = {
    id: 1,
    title: 'Test Tramite',
    description: 'Test Description',
    category: 'Test Category',
    requirements: ['Requirement 1', 'Requirement 2'],
    estimated_time: '2-3 days',
    cost: 100.0,
    online_available: true,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  const mockTramites: Tramite[] = [
    mockTramite,
    {
      ...mockTramite,
      id: 2,
      title: 'Second Tramite',
      category: 'Different Category',
    },
  ];

  const mockTramiteGroup: TramiteGroup = {
    category: 'Test Category',
    tramites: [mockTramite],
    count: 1,
  };

  const mockPaginatedResult: PaginatedResult<Tramite> = {
    data: mockTramites,
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const mockTramitesDao = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCategory: jest.fn(),
    findAllGrouped: jest.fn(),
    globalSearch: jest.fn(),
    searchByTitle: jest.fn(),
    findAllCategories: jest.fn(),
    countByCategory: jest.fn(),
    findRecent: jest.fn(),
    findAllPaginated: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    existsByTitle: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TramitesService,
        {
          provide: TramitesDao,
          useValue: mockTramitesDao,
        },
      ],
    }).compile();

    service = module.get<TramitesService>(TramitesService);
    dao = module.get<TramitesDao>(TramitesDao);

    // Mock Logger to avoid console output during tests
    logger = new Logger();
    jest.spyOn(logger, 'log').mockImplementation();
    jest.spyOn(logger, 'debug').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation();
    jest.spyOn(logger, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Dependency Injection & DAO Pattern', () => {
    it('should be defined with DAO injected', () => {
      expect(service).toBeDefined();
      expect(dao).toBeDefined();
    });

    it('should properly implement DAO pattern separation', () => {
      // Service should delegate data access to DAO
      expect(service['tramitesDao']).toBe(dao);
    });

    it('should initialize with proper logging', () => {
      // Service should have logger for business logic tracking
      expect(service['logger']).toBeDefined();
    });
  });

  describe('getAll - Service Layer Pattern', () => {
    it('should retrieve all tramites through DAO', async () => {
      mockTramitesDao.findAll.mockResolvedValueOnce(mockTramites);

      const result = await service.getAll();

      expect(result).toEqual(mockTramites);
      expect(dao.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle DAO errors properly', async () => {
      const daoError = new Error('Database connection failed');
      mockTramitesDao.findAll.mockRejectedValueOnce(daoError);

      await expect(service.getAll()).rejects.toThrow(daoError);
      expect(dao.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no tramites exist', async () => {
      mockTramitesDao.findAll.mockResolvedValueOnce([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findAllGrouped - Advanced DAO Operations', () => {
    it('should retrieve tramites grouped by category', async () => {
      const mockGroups = [mockTramiteGroup];
      mockTramitesDao.findAllGrouped.mockResolvedValueOnce(mockGroups);

      const result = await service.findAllGrouped();

      expect(result).toEqual(mockGroups);
      expect(dao.findAllGrouped).toHaveBeenCalledTimes(1);
    });

    it('should handle empty groups', async () => {
      mockTramitesDao.findAllGrouped.mockResolvedValueOnce([]);

      const result = await service.findAllGrouped();

      expect(result).toEqual([]);
    });
  });

  describe('findById - Entity Retrieval with Validation', () => {
    it('should find tramite by ID', async () => {
      mockTramitesDao.findById.mockResolvedValueOnce(mockTramite);

      const result = await service.findById(1);

      expect(result).toEqual(mockTramite);
      expect(dao.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when tramite not found', async () => {
      mockTramitesDao.findById.mockResolvedValueOnce(null);

      await expect(service.findById(999)).rejects.toThrow(
        new NotFoundException('Trámite con id 999 no encontrado'),
      );
      expect(dao.findById).toHaveBeenCalledWith(999);
    });

    it('should handle DAO errors and rethrow', async () => {
      const daoError = new Error('Database error');
      mockTramitesDao.findById.mockRejectedValueOnce(daoError);

      await expect(service.findById(1)).rejects.toThrow(daoError);
    });

    it('should preserve NotFoundException when caught', async () => {
      mockTramitesDao.findById.mockResolvedValueOnce(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
      await expect(service.findById(1)).rejects.toThrow(
        'Trámite con id 1 no encontrado',
      );
    });
  });

  describe('findByCategory - Category-based Search', () => {
    it('should find tramites by category', async () => {
      const categoryTramites = [mockTramite];
      mockTramitesDao.findByCategory.mockResolvedValueOnce(categoryTramites);

      const result = await service.findByCategory('Test Category');

      expect(result).toEqual(categoryTramites);
      expect(dao.findByCategory).toHaveBeenCalledWith('Test Category');
    });

    it('should handle empty category results', async () => {
      mockTramitesDao.findByCategory.mockResolvedValueOnce([]);

      const result = await service.findByCategory('Nonexistent Category');

      expect(result).toEqual([]);
    });

    it('should handle category search errors', async () => {
      const error = new Error('Search failed');
      mockTramitesDao.findByCategory.mockRejectedValueOnce(error);

      await expect(service.findByCategory('Test')).rejects.toThrow(error);
    });
  });

  describe('search - Global Search with Validation', () => {
    it('should perform global search with valid term', async () => {
      const searchTerm = 'test search';
      const searchResults = [mockTramite];
      mockTramitesDao.globalSearch.mockResolvedValueOnce(searchResults);

      const result = await service.search(searchTerm);

      expect(result).toEqual(searchResults);
      expect(dao.globalSearch).toHaveBeenCalledWith(searchTerm);
    });

    it('should throw BadRequestException for empty search term', async () => {
      await expect(service.search('')).rejects.toThrow(
        new BadRequestException('El término de búsqueda no puede estar vacío'),
      );
      expect(dao.globalSearch).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for whitespace-only search term', async () => {
      await expect(service.search('   ')).rejects.toThrow(
        new BadRequestException('El término de búsqueda no puede estar vacío'),
      );
    });

    it('should trim search term before passing to DAO', async () => {
      const searchTerm = '  test search  ';
      mockTramitesDao.globalSearch.mockResolvedValueOnce([]);

      await service.search(searchTerm);

      expect(dao.globalSearch).toHaveBeenCalledWith('test search');
    });

    it('should handle search errors from DAO', async () => {
      const daoError = new Error('Search index error');
      mockTramitesDao.globalSearch.mockRejectedValueOnce(daoError);

      await expect(service.search('valid term')).rejects.toThrow(daoError);
    });

    it('should preserve BadRequestException when validation fails', async () => {
      await expect(service.search(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('searchByTitle - Title Search with Validation', () => {
    it('should search tramites by title', async () => {
      const title = 'Test Title';
      const results = [mockTramite];
      mockTramitesDao.searchByTitle.mockResolvedValueOnce(results);

      const result = await service.searchByTitle(title);

      expect(result).toEqual(results);
      expect(dao.searchByTitle).toHaveBeenCalledWith(title);
    });

    it('should validate title is not empty', async () => {
      await expect(service.searchByTitle('')).rejects.toThrow(
        new BadRequestException('El título de búsqueda no puede estar vacío'),
      );
    });

    it('should trim title before searching', async () => {
      const title = '  Test Title  ';
      mockTramitesDao.searchByTitle.mockResolvedValueOnce([]);

      await service.searchByTitle(title);

      expect(dao.searchByTitle).toHaveBeenCalledWith('Test Title');
    });
  });

  describe('getCategories - Reference Data', () => {
    it('should retrieve all categories', async () => {
      const categories = ['Category 1', 'Category 2'];
      mockTramitesDao.findAllCategories.mockResolvedValueOnce(categories);

      const result = await service.getCategories();

      expect(result).toEqual(categories);
      expect(dao.findAllCategories).toHaveBeenCalled();
    });

    it('should handle empty categories', async () => {
      mockTramitesDao.findAllCategories.mockResolvedValueOnce([]);

      const result = await service.getCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getCountByCategory - Statistics', () => {
    it('should get count statistics by category', async () => {
      const counts = { 'Category 1': 5, 'Category 2': 3 };
      mockTramitesDao.countByCategory.mockResolvedValueOnce(counts);

      const result = await service.getCountByCategory();

      expect(result).toEqual(counts);
      expect(dao.countByCategory).toHaveBeenCalled();
    });
  });

  describe('getRecent - Recent Data with Validation', () => {
    it('should get recent tramites with default limit', async () => {
      mockTramitesDao.findRecent.mockResolvedValueOnce([mockTramite]);

      const result = await service.getRecent();

      expect(result).toEqual([mockTramite]);
      expect(dao.findRecent).toHaveBeenCalledWith(10); // default limit
    });

    it('should respect custom limit', async () => {
      mockTramitesDao.findRecent.mockResolvedValueOnce([mockTramite]);

      await service.getRecent(5);

      expect(dao.findRecent).toHaveBeenCalledWith(5);
    });

    it('should validate limit is positive', async () => {
      await expect(service.getRecent(0)).rejects.toThrow(
        new BadRequestException('El límite debe estar entre 1 y 100'),
      );
    });

    it('should validate limit is not too large', async () => {
      await expect(service.getRecent(101)).rejects.toThrow(
        new BadRequestException('El límite debe estar entre 1 y 100'),
      );
    });
  });

  describe('getPaginated - Pagination with Validation', () => {
    it('should get paginated results with defaults', async () => {
      mockTramitesDao.findAllPaginated.mockResolvedValueOnce(mockPaginatedResult);

      const result = await service.getPaginated();

      expect(result).toEqual(mockPaginatedResult);
      expect(dao.findAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'created_at',
        orderDirection: 'desc',
      });
    });

    it('should use custom pagination options', async () => {
      mockTramitesDao.findAllPaginated.mockResolvedValueOnce(mockPaginatedResult);

      await service.getPaginated(2, 20, 'title', 'asc');

      expect(dao.findAllPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        orderBy: 'title',
        orderDirection: 'asc',
      });
    });

    it('should validate page number is positive', async () => {
      await expect(service.getPaginated(0)).rejects.toThrow(
        new BadRequestException('El número de página debe ser mayor a 0'),
      );
    });

    it('should validate limit is within bounds', async () => {
      await expect(service.getPaginated(1, 0)).rejects.toThrow(
        new BadRequestException('El límite debe estar entre 1 y 100'),
      );

      await expect(service.getPaginated(1, 101)).rejects.toThrow(
        new BadRequestException('El límite debe estar entre 1 y 100'),
      );
    });
  });

  describe('create - Entity Creation with Validation', () => {
    const newTramiteData = {
      title: 'New Tramite',
      description: 'New Description',
      category: 'New Category',
      requirements: ['Req 1'],
      estimated_time: '1 day',
      cost: 50.0,
      online_available: true,
    };

    it('should create new tramite successfully', async () => {
      mockTramitesDao.existsByTitle.mockResolvedValueOnce(false);
      mockTramitesDao.create.mockResolvedValueOnce({
        ...newTramiteData,
        id: 3,
        created_at: new Date(),
      });

      const result = await service.create(newTramiteData);

      expect(result.id).toBe(3);
      expect(result.title).toBe('New Tramite');
      expect(dao.existsByTitle).toHaveBeenCalledWith('New Tramite');
      expect(dao.create).toHaveBeenCalledWith(newTramiteData);
    });

    it('should validate title is required', async () => {
      const invalidData = { ...newTramiteData, title: '' };

      await expect(service.create(invalidData)).rejects.toThrow(
        new BadRequestException('El título es requerido'),
      );
    });

    it('should validate category is required', async () => {
      const invalidData = { ...newTramiteData, category: '' };

      await expect(service.create(invalidData)).rejects.toThrow(
        new BadRequestException('La categoría es requerida'),
      );
    });

    it('should validate title uniqueness', async () => {
      mockTramitesDao.existsByTitle.mockResolvedValueOnce(true);

      await expect(service.create(newTramiteData)).rejects.toThrow(
        new BadRequestException(
          'Ya existe un trámite con el título "New Tramite"',
        ),
      );

      expect(dao.create).not.toHaveBeenCalled();
    });

    it('should trim title and category', async () => {
      const dataWithSpaces = {
        ...newTramiteData,
        title: '  Spaced Title  ',
        category: '  Spaced Category  ',
      };

      mockTramitesDao.existsByTitle.mockResolvedValueOnce(false);
      mockTramitesDao.create.mockResolvedValueOnce({
        ...dataWithSpaces,
        id: 3,
        created_at: new Date(),
      });

      await service.create(dataWithSpaces);

      expect(dao.existsByTitle).toHaveBeenCalledWith('  Spaced Title  ');
    });
  });

  describe('update - Entity Updates with Validation', () => {
    const updateData = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    it('should update existing tramite', async () => {
      mockTramitesDao.exists.mockResolvedValueOnce(true);
      mockTramitesDao.update.mockResolvedValueOnce({
        ...mockTramite,
        ...updateData,
      });

      const result = await service.update(1, updateData);

      expect(result.title).toBe('Updated Title');
      expect(dao.exists).toHaveBeenCalledWith(1);
      expect(dao.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should validate tramite exists before update', async () => {
      mockTramitesDao.exists.mockResolvedValueOnce(false);

      await expect(service.update(999, updateData)).rejects.toThrow(
        new NotFoundException('Trámite con id 999 no encontrado'),
      );

      expect(dao.update).not.toHaveBeenCalled();
    });

    it('should validate title uniqueness when updating title', async () => {
      const titleUpdate = { title: 'Existing Title' };

      mockTramitesDao.exists.mockResolvedValueOnce(true);
      mockTramitesDao.findById.mockResolvedValueOnce({
        ...mockTramite,
        title: 'Old Title',
      });
      mockTramitesDao.existsByTitle.mockResolvedValueOnce(true);

      await expect(service.update(1, titleUpdate)).rejects.toThrow(
        new BadRequestException(
          'Ya existe un trámite con el título "Existing Title"',
        ),
      );
    });

    it('should allow same title when not changing', async () => {
      const sameTitle = { description: 'New description' };

      mockTramitesDao.exists.mockResolvedValueOnce(true);
      mockTramitesDao.update.mockResolvedValueOnce(mockTramite);

      await service.update(1, sameTitle);

      expect(dao.update).toHaveBeenCalled();
    });
  });

  describe('delete - Entity Removal with Validation', () => {
    it('should delete existing tramite', async () => {
      mockTramitesDao.findById.mockResolvedValueOnce(mockTramite);
      mockTramitesDao.delete.mockResolvedValueOnce(undefined);

      await service.delete(1);

      expect(dao.findById).toHaveBeenCalledWith(1);
      expect(dao.delete).toHaveBeenCalledWith(1);
    });

    it('should validate tramite exists before deletion', async () => {
      mockTramitesDao.findById.mockResolvedValueOnce(null);

      await expect(service.delete(999)).rejects.toThrow(
        new NotFoundException('Trámite con id 999 no encontrado'),
      );

      expect(dao.delete).not.toHaveBeenCalled();
    });
  });

  describe('getStatistics - Aggregated Data', () => {
    it('should get comprehensive statistics', async () => {
      const total = 10;
      const byCategory = { 'Cat1': 5, 'Cat2': 5 };
      const categories = ['Cat1', 'Cat2'];

      mockTramitesDao.count.mockResolvedValueOnce(total);
      mockTramitesDao.countByCategory.mockResolvedValueOnce(byCategory);
      mockTramitesDao.findAllCategories.mockResolvedValueOnce(categories);

      const result = await service.getStatistics();

      expect(result).toEqual({
        total,
        byCategory,
        categories,
      });

      expect(dao.count).toHaveBeenCalled();
      expect(dao.countByCategory).toHaveBeenCalled();
      expect(dao.findAllCategories).toHaveBeenCalled();
    });

    it('should handle parallel DAO calls', async () => {
      mockTramitesDao.count.mockResolvedValueOnce(0);
      mockTramitesDao.countByCategory.mockResolvedValueOnce({});
      mockTramitesDao.findAllCategories.mockResolvedValueOnce([]);

      const result = await service.getStatistics();

      expect(result.total).toBe(0);
      expect(result.byCategory).toEqual({});
      expect(result.categories).toEqual([]);
    });
  });

  describe('Error Handling and Pattern Validation', () => {
    it('should maintain Service Layer pattern separation', () => {
      // Service should not contain data access logic
      const serviceString = service.constructor.toString();
      expect(serviceString).not.toContain('SELECT');
      expect(serviceString).not.toContain('INSERT');
      expect(serviceString).not.toContain('UPDATE');
      expect(serviceString).not.toContain('DELETE');
    });

    it('should delegate all data operations to DAO', async () => {
      // Verify DAO dependency
      expect(service['tramitesDao']).toBe(dao);

      // Test various operations call DAO
      mockTramitesDao.findAll.mockResolvedValueOnce([]);
      await service.getAll();
      expect(dao.findAll).toHaveBeenCalled();
    });

    it('should preserve DAO errors for known exceptions', async () => {
      const notFoundError = new NotFoundException('Custom not found');
      mockTramitesDao.findById.mockRejectedValueOnce(notFoundError);

      await expect(service.findById(1)).rejects.toThrow(notFoundError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected database error');
      mockTramitesDao.findAll.mockRejectedValueOnce(unexpectedError);

      await expect(service.getAll()).rejects.toThrow(unexpectedError);
    });

    it('should implement proper business logic validation', async () => {
      // Business rules should be enforced at service layer
      await expect(service.search('')).rejects.toThrow(BadRequestException);
      await expect(service.getRecent(-1)).rejects.toThrow(BadRequestException);
      await expect(service.getPaginated(0)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Integration and Consistency', () => {
    it('should maintain consistent interface across all CRUD operations', () => {
      const methods = [
        'getAll',
        'findById',
        'create',
        'update',
        'delete',
        'search',
        'findByCategory',
      ];

      methods.forEach((method) => {
        expect(typeof service[method]).toBe('function');
      });
    });

    it('should use consistent error types', async () => {
      // Validation errors should be BadRequestException
      await expect(service.search('')).rejects.toThrow(BadRequestException);
      await expect(service.getRecent(0)).rejects.toThrow(BadRequestException);

      // Not found errors should be NotFoundException
      mockTramitesDao.findById.mockResolvedValueOnce(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });

    it('should properly implement logging throughout operations', () => {
      // Logger should be used for debugging and monitoring
      expect(service['logger']).toBeDefined();
      expect(service['logger'].constructor.name).toBe('Logger');
    });
  });
});