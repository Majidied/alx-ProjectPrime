import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface TechnologyCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ icon, title, description }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        boxShadow: 1,
        borderRadius: '8px',
        textAlign: 'left',
        margin: '8px 0',
        cursor: description ? 'pointer' : 'default',  // Only allow pointer cursor if there's a description to expand
      }}
      onClick={() => description && setExpanded(!expanded)}
    >
      <Box sx={{ marginRight: '16px' }}>{icon}</Box>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: 'text.secondary', marginTop: '4px' }}>
            {description.length > 50 && !expanded
              ? `${description.substring(0, 50)}...`
              : description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnologyCard;
