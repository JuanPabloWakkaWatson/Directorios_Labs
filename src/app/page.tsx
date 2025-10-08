// ============================================
// src/app/page.tsx
// Página principal con Material-UI
// ============================================
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, CardActionArea, Chip } from '@mui/material';
import { Search as SearchIcon, LocationOn, Email } from '@mui/icons-material';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

async function getLaboratories() {
  const laboratories = await prisma.laboratory.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      location: true,
      email: true,
      _count: {
        select: {
          posts: { where: { published: true } },
          events: { where: { isPublic: true } },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return laboratories;
}

export default async function HomePage() {
  const laboratories = await getLaboratories();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #003057 0%, #0066A1 100%)',
          color: 'white',
          py: 10,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Directorio de Laboratorios
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px' }}>
            Explora los laboratorios de investigación y desarrollo del departamento de
            ingeniería en computación del ITAM
          </Typography>
        </Container>
      </Box>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          {laboratories.length} Laboratorio{laboratories.length !== 1 ? 's' : ''} Disponible
          {laboratories.length !== 1 ? 's' : ''}
        </Typography>

        <Grid container spacing={4}>
          {laboratories.map((lab) => (
            <Grid item xs={12} sm={6} md={4} key={lab.id}>
              <Card>
                <CardActionArea component={Link} href={`/laboratorio/${lab.slug}`}>
                  {lab.logo && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={lab.logo}
                      alt={lab.name}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2" fontWeight={600}>
                      {lab.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: 60 }}
                    >
                      {lab.description}
                    </Typography>

                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {lab.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {lab.email}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        {lab._count.posts} publicaciones
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lab._count.events} eventos
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 Instituto Tecnológico Autónomo de México (ITAM)
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.8 }}>
            Departamento de Ingeniería en Computación
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}